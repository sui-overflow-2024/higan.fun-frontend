import {Fetcher} from "swr";
import {getBuyCoinPriceTxb, getSellCoinPriceTxb} from "@/components/BuySellDialog";
import type {SuiClient} from '@mysten/sui.js/client';
import {bcs} from "@mysten/sui.js/bcs";

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