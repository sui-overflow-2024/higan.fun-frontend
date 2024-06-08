'use client';
import {useSignTransactionBlock, useSuiClientContext} from "@mysten/dapp-kit";
import type {TransactionBlock} from "@mysten/sui.js/transactions";
import type {SuiTransactionBlockResponse} from "@mysten/sui.js/client";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import Link from "next/link";
import React from "react";
import {copyTextToClipboard} from "@/lib/utils";
import {Button} from "@/components/ui/button";

export function useTransactionExecution() {
    const suiCtx = useSuiClientContext()
    const {mutateAsync: signTransactionBlock} = useSignTransactionBlock();
    const {toast} = useToast();

    const executeTransaction = async (
        txb: TransactionBlock,
    ): Promise<SuiTransactionBlockResponse | void> => {
        try {
            const signature = await signTransactionBlock({
                transactionBlock: txb,
            });

            const res = await suiCtx.client.executeTransactionBlock({
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
                action: (<ToastAction altText="View tx in explorer">
                        <Link
                            href={`https://suiscan.xyz/${suiCtx.network}/tx/${res.digest}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            View in explorer
                        </Link>
                    </ToastAction>
                )
            })
            return res;
        } catch (e: any) {
            toast({
                title: "Failed to execute transaction",
                duration: 3000,
                variant: "destructive",
                // description: e.message,
                action: (<Button onClick={() => copyTextToClipboard(e.message)}>
                    Copy error
                </Button>)
            })
        }
    };

    return executeTransaction;
}