import {Fetcher} from "swr";
import {getBuyCoinPriceTxb, getSellCoinPriceTxb} from "@/components/BuySellDialog";
import type {SuiClient} from '@mysten/sui.js/client';
import {bcs} from "@mysten/sui.js/bcs";
import {getCoinTypePath, getManagerFuncPath} from "@/lib/utils";
import {CoinFromRestAPI} from "@/lib/types";
import {TransactionBlock} from "@mysten/sui.js/transactions";

export type TokenMetric = {
    tokenPrice: number,
    suiBalance: number,
    totalSupply: number,
}
export type TokenMetricKey = {
    managerContractPackageId: string,
    managerContractModuleName: string,
    path: "tokenMetrics",
    client: SuiClient,
    sender: string,
    coin?: CoinFromRestAPI,
}

export type GetOneCoinPriceKey = {
    managerContractPackageId: string,
    managerContractModuleName: string,
    suiClient: SuiClient,
    sender: string,
    coinType: string,
    bondingCurveId: string,
    amount: number,
    mode: "buy" | "sell"
}

type SuiSwrFetchers = {
    getCurrentCoinPriceInSui: Fetcher<number, GetOneCoinPriceKey>,
}

export const customSuiHooks: SuiSwrFetchers = {
    getCurrentCoinPriceInSui: async ({
                                         managerContractPackageId,
                                         managerContractModuleName,
                                         suiClient,
                                         sender,
                                         coinType,
                                         bondingCurveId,
                                         amount,
                                         mode,
                                     }) => {
        console.log(`get coin ${mode} price for type ${coinType}`, sender)
        const txb = mode === "buy" ? getBuyCoinPriceTxb(managerContractPackageId, managerContractModuleName, coinType, bondingCurveId, amount) : getSellCoinPriceTxb(managerContractPackageId, managerContractModuleName, coinType, bondingCurveId, amount)
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
                                                                                managerContractPackageId,
                                                                                managerContractModuleName,
                                                                                client,
                                                                                sender,
                                                                                coin
                                                                            }): Promise<TokenMetric> => {
    if (!coin) {
        return {tokenPrice: 0, suiBalance: 0, totalSupply: 0};
    }


    const txb = new TransactionBlock()
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_coin_buy_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.pure(Math.pow(10, coin.decimals)) // Functionally, the app handles everything in non-fractional units.
        ],
        typeArguments: [getCoinTypePath(coin)],
    });
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_sui_balance") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(coin.bondingCurveId),
        ],
        typeArguments: [getCoinTypePath(coin)],
    });
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_coin_total_supply") as `${string}::${string}::${string}`,
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