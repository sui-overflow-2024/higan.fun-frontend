import {Fetcher} from "swr";
import {getBuyCoinPriceTxb, getSellCoinPriceTxb} from "@/components/BuySellDialog";
import type {SuiClient} from '@mysten/sui.js/client';
import {bcs} from "@mysten/sui.js/bcs";
import {getCoinPathFunc} from "@/lib/utils";
import {CoinFromRestAPI} from "@/lib/types";
import {TransactionBlock} from "@mysten/sui.js/transactions";

export type TokenMetric = {
    tokenPrice: number,
    suiBalance: number,
    totalSupply: number,
}
export type TokenMetricKey = {
    path: "tokenMetrics",
    client: SuiClient,
    sender: string,
    coin?: CoinFromRestAPI,
}

type SuiSwrFetchers = {
    getCurrentCoinPriceInSui: Fetcher<number, {
        suiClient: SuiClient,
        sender: string,
        coinType: string,
        storeId: string,
        amount: number,
        mode: "buy" | "sell"
    }>,
}

export const customSuiHooks: SuiSwrFetchers = {
    getCurrentCoinPriceInSui: async ({
                                         suiClient,
                                         sender,
                                         coinType,
                                         storeId,
                                         amount,
                                         mode,
                                     }) => {
        console.log(`get coin ${mode} price`, sender)
        console.log("suiClient in SWR", suiClient)
        const txb = mode === "buy" ? getBuyCoinPriceTxb(coinType, storeId, amount) : getSellCoinPriceTxb(coinType, storeId, amount)
        txb.setSenderIfNotSet(sender)

        const res = await suiClient.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: sender,
        });
        console.log("Inspect result", res)

        const price = res.results?.[0]?.returnValues?.[0][0]
        return bcs.de("u64", new Uint8Array(price || []))
    }
}

export const getTokenMetrics: Fetcher<TokenMetric, TokenMetricKey> = async ({
                                                                                client,
                                                                                sender,
                                                                                coin
                                                                            }): Promise<TokenMetric> => {
    if (!coin) {
        return {tokenPrice: 0, suiBalance: 0, totalSupply: 0};
    }

    const txb = new TransactionBlock()
    txb.moveCall({
        target: getCoinPathFunc(coin, "get_coin_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.storeId),
        ],
    });
    txb.moveCall({
        target: getCoinPathFunc(coin, "get_sui_balance") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.storeId),
        ],
    });
    txb.moveCall({
        target: getCoinPathFunc(coin, "get_coin_total_supply") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.storeId),
        ],
    });
    const res = await client.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: sender,
    });
    console.log("Inspect result", res)

    const price = res.results?.[0]?.returnValues?.[0][0]
    let suiBalanceEncoded = res.results?.[1]?.returnValues?.[0][0]
    let tokenTotalSupply = res.results?.[2]?.returnValues?.[0][0]

    return {
        tokenPrice: bcs.de("u64", new Uint8Array(price || [])) as number,
        suiBalance: bcs.de("u64", new Uint8Array(suiBalanceEncoded || [])) as number,
        totalSupply: bcs.de("u64", new Uint8Array(tokenTotalSupply || [])) as number,
    }
}