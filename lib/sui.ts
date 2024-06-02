import {Fetcher} from "swr";
import {getBuyCoinPriceTxb, getSellCoinPriceTxb} from "@/components/BuySellDialog";
import type {SuiClient} from '@mysten/sui.js/client';
import {bcs} from "@mysten/sui.js/bcs";
import {getCoinTypePath, getManagerFuncPath} from "@/lib/utils";
import {CoinFromRestAPI} from "@/lib/types";
import {TransactionBlock} from "@mysten/sui.js/transactions";

import {AppConfig} from "@/lib/config";

export type TokenMetric = {
    tokenPrice: number,
    suiBalance: number,
    totalSupply: number,
}
export type TokenMetricKey = {
    appConfig: AppConfig,
    path: "tokenMetrics",
    client: SuiClient,
    sender: string,
    coin?: CoinFromRestAPI,
}

type SuiSwrFetchers = {
    getCurrentCoinPriceInSui: Fetcher<number, {
        appConfig: AppConfig,
        suiClient: SuiClient,
        sender: string,
        coinType: string,
        bondingCurveId: string,
        amount: number,
        mode: "buy" | "sell"
    }>,
}

export const customSuiHooks: SuiSwrFetchers = {
    getCurrentCoinPriceInSui: async ({
                                         appConfig,
                                         suiClient,
                                         sender,
                                         coinType,
                                         bondingCurveId,
                                         amount,
                                         mode,
                                     }) => {
        console.log(`get coin ${mode} price for type ${coinType}`, sender)
        const txb = mode === "buy" ? getBuyCoinPriceTxb(appConfig, coinType, bondingCurveId, amount) : getSellCoinPriceTxb(appConfig, coinType, bondingCurveId, amount)
        txb.setSenderIfNotSet(sender)

        const res = await suiClient.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: sender,
        });
        // console.log("Inspect result", res)

        const price = res.results?.[0]?.returnValues?.[0][0]
        return bcs.de("u64", new Uint8Array(price || []))
    }
}

export const getTokenMetrics: Fetcher<TokenMetric, TokenMetricKey> = async ({
                                                                                appConfig,
                                                                                client,
                                                                                sender,
                                                                                coin
                                                                            }): Promise<TokenMetric> => {
    if (!coin) {
        return {tokenPrice: 0, suiBalance: 0, totalSupply: 0};
    }


    const txb = new TransactionBlock()
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_coin_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.bondingCurveId),
        ],
        typeArguments: [getCoinTypePath(coin)],
    });
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_sui_balance") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.bondingCurveId),
        ],
        typeArguments: [getCoinTypePath(coin)],
    });
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_coin_total_supply") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.bondingCurveId),
        ],
        typeArguments: [getCoinTypePath(coin)],
    });

    const res = await client.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: sender,
    });
    // console.log("Inspect result", res)

    const price = res.results?.[0]?.returnValues?.[0][0]
    let suiBalanceEncoded = res.results?.[1]?.returnValues?.[0][0]
    let tokenTotalSupply = res.results?.[2]?.returnValues?.[0][0]

    return {
        tokenPrice: bcs.de("u64", new Uint8Array(price || [])) as number,
        suiBalance: bcs.de("u64", new Uint8Array(suiBalanceEncoded || [])) as number,
        totalSupply: bcs.de("u64", new Uint8Array(tokenTotalSupply || [])) as number,
    }
}