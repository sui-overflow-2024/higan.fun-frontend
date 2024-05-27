'use client';
import {useSignTransactionBlock, useSuiClient} from "@mysten/dapp-kit";
import type {TransactionBlock} from "@mysten/sui.js/transactions";
import type {SuiTransactionBlockResponse} from "@mysten/sui.js/client";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import Link from "next/link";
import React from "react";

export function useTransactionExecution() {
    const client = useSuiClient();
    const {mutateAsync: signTransactionBlock} = useSignTransactionBlock();
    const {toast} = useToast();

    const executeTransaction = async (
        txb: TransactionBlock,
    ): Promise<SuiTransactionBlockResponse | void> => {
        try {
            const signature = await signTransactionBlock({
                transactionBlock: txb,
            });

            const res = await client.executeTransactionBlock({
                transactionBlock: signature.transactionBlockBytes,
                signature: signature.signature,
                options: {
                    showEffects: true,
                    showObjectChanges: true,
                },
            });
            toast({
                    title: "Successfully executed transaction!",
                    duration: 3000,
        //             action: (<ToastAction altText="View tx in explorer">
        //                          <Link href={`/coin/${result.packageId}`}>
        //         Go to landing page
        //     </Link>
        //     </ToastAction>
        // )
        })


            return res;
        } catch (e: any) {
            toast({
                title: "Failed to execute transaction",
                duration: 3000,
                variant: "destructive",
                description: e.message,
            })
        }
    };

    return executeTransaction;
}