'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useEffect, useState} from "react";
import {getCoinTypePath} from "@/lib/utils";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import {useCurrentAccount, useSignTransactionBlock, useSuiClientContext, useSuiClientQuery} from "@mysten/dapp-kit";
import {TransactionBlock,} from "@mysten/sui.js/transactions";
import {SubmitHandler, useForm} from "react-hook-form";
import {useToast} from "@/components/ui/use-toast";
import {useContextSelector} from "use-context-selector";
import {addLiquidity, getAllUserCoins, getExactCoinByAmount, getOptimalLpSwapAmount, Pool} from "@/lib/kriya";
import {SUI_COIN_TYPE} from "@/lib/config";
import {Input} from "@/components/ui/input";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";

type AddLiqForm = {
    amountX: bigint,
    amountY: bigint,
    // minAddAmountX: bigint,
    // minAddAmountY: bigint,
    txb: TransactionBlock,
    transferToAddress?: string
}
const AddLiquidityForm: React.FC<{ coin: CoinFromRestAPI, pool: Pool }> = ({coin, pool}) => {
    const {toast} = useToast()
    const account = useCurrentAccount()
    const kriyaPackageId = useContextSelector(AppConfigContext, v => v.kriyaPackageId)
    const {mutateAsync: signTransactionBlock} = useSignTransactionBlock();
    const suiClientCtx = useSuiClientContext();
    const [lastInputState, setLastInputState] = useState<"lastInputX" | "lastInputY" | null>(null)
    const {register, handleSubmit, formState: {errors}, setValue, watch} = useForm<AddLiqForm>({
        defaultValues: {
            amountX: BigInt(0),
            amountY: BigInt(0),
            // minAddAmountX: BigInt(0),
            // minAddAmountY: BigInt(0),
            transferToAddress: account?.address || ""
        }
    });
    const amountX = watch('amountX');
    // const amountX = watch('amountX') * BigInt(Math.pow(10, coin.decimals));
    const amountY = watch('amountY'); //Coin is always SUI
    // const amountY = watch('amountY') * BigInt(Math.pow(10, 9)); //Coin is always SUI

    const sign = useTransactionExecution()
    const {data: memeBalance, refetch: refetchMeme} = useSuiClientQuery("getBalance", {
        owner: account?.address || "",
        coinType: getCoinTypePath(coin)
    })

    const {data: suiBalance, refetch: refetchSui} = useSuiClientQuery("getBalance", {
        owner: account?.address || "",
        coinType: SUI_COIN_TYPE,
    })

    useEffect(() => {
        const fetchOptimalY = async () => {
            console.log("lastInputState in post X", lastInputState)
            if (lastInputState === 'lastInputY' || !memeBalance || !suiBalance) return;
            const calculatedAmountY = await getOptimalLpSwapAmount({
                suiClientCtx,
                poolId: pool.objectId,
                inputAmt: amountX,
                isXtoY: true,
                isStable: false,
            });
            setValue('amountY', calculatedAmountY);
        }
        fetchOptimalY()
    }, [amountX, lastInputState, memeBalance, pool.objectId, setValue, suiBalance, suiClientCtx]);

    useEffect(() => {
        console.log("lastInputState in post Y", lastInputState)
        if (lastInputState === 'lastInputX' || !memeBalance || !suiBalance) return;
        const fetchOptimalX = async () => {
            const calculatedAmountX = await getOptimalLpSwapAmount({
                suiClientCtx,
                poolId: pool.objectId,
                inputAmt: amountY,
                isXtoY: false,
                isStable: false,
            });
            setValue('amountX', calculatedAmountX);
        }
        fetchOptimalX()
    }, [amountX, amountY, coin.symbol, lastInputState, memeBalance?.totalBalance, pool.objectId, setValue, suiBalance?.totalBalance, suiClientCtx]);


    const onSubmit: SubmitHandler<AddLiqForm> = async (data) => {
        if (!account) {
            toast({
                title: "Account not found",
                description: "Please connect your wallet",
                variant: "destructive",
                duration: 3000
            })
            return
        }
        console.log("data", data)

        const txb = new TransactionBlock();

        console.log("Getting all coins for", account.address, "coin", pool.tokenXType)
        const allCoinX = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            type: pool.tokenXType,
            address: account.address,
        });
        const coinX = getExactCoinByAmount(pool.tokenXType, allCoinX, data.amountX, txb)

        console.log("Getting all coins for", account.address, "coin", pool.tokenYType)
        const allCoinY = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            type: pool.tokenXType,
            address: account.address,
        });
        const coinY = getExactCoinByAmount(pool.tokenYType, allCoinY, data.amountY, txb)

        console.log("kriyaPackageId", kriyaPackageId, "account", account, "suiClient", suiClientCtx.client, "pool", pool, "amountX", data.amountX, "amountY", data.amountY, "coinX", coinX, "coinY", coinY, "txb", txb, "transferToAddress", account.address)
        const lpObject = await addLiquidity({
            kriyaPackageId,
            account,
            suiClient: suiClientCtx.client,
            pool,
            amountX: data.amountX,
            amountY: data.amountY,
            minAddAmountX: BigInt(0), //TODO revisit these numbers if you hit arrors
            minAddAmountY: BigInt(0),
            coinX,
            coinY,
            txb,
            transferToAddress: account.address
        });

        const devAttempt = await suiClientCtx.client.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: account.address,
        });
        console.log("Dev attempt", devAttempt)
        const res = await sign(txb)
        // const signature = await signTransactionBlock({
        //     transactionBlock: txb,
        // });
        // const res = await suiClientCtx.client.executeTransactionBlock({
        //     transactionBlock: signature.transactionBlockBytes,
        //     signature: signature.signature,
        //     options: {
        //         showEffects: true,
        //         showObjectChanges: true,
        //     },
        // });

        await refetchMeme()
        await refetchSui()

        // res.errors && console.error("Error", res.errors)
        console.log("Add liquidity response", res)
    };

    const exceedXBalance = BigInt(memeBalance?.totalBalance || 0) === BigInt(0) || amountX > BigInt(memeBalance?.totalBalance || 0)
    const exceedYBalance = BigInt(suiBalance?.totalBalance || 0) === BigInt(0) || amountY > BigInt(suiBalance?.totalBalance || 0)

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-2 w-96"}>
                <div className={"flex gap-4"}>
                    <div>Amount X:</div>
                    <Input type="number" {...register('amountX', {
                        required: true,
                        onChange: () => setLastInputState('lastInputX'),
                        setValueAs: (v) => BigInt(v)
                    })} />
                    {errors.amountX && <span>This field is required</span>}
                </div>
                <p>${coin.symbol} balance: {memeBalance?.totalBalance}</p>
                <div className={"flex gap-4"}>
                    <div>Amount Y:</div>
                    <Input type="number" {...register('amountY', {
                        required: true,
                        onChange: () => setLastInputState('lastInputY'),
                        setValueAs: (v) => BigInt(v)
                    })} />
                    {errors.amountY && <span>This field is required</span>}
                </div>
                <p>SUI Balance: {suiBalance?.totalBalance}</p>
                <div className={"text-red-500"}>
                    {exceedXBalance && `Insufficient ${coin.symbol} balance`}
                </div>
                <div className={"text-red-500"}>
                    {exceedYBalance && `Insufficient SUI balance`}
                </div>
                <Button
                    disabled={exceedXBalance || exceedYBalance}
                    type="submit">Add Liquidity</Button>
            </form>
        </>
    );
}

export const AddRemoveLiquidityDialog: React.FC<{
    token: CoinFromRestAPI,
}> = ({token}) => {
    const currentAccount = useCurrentAccount()
    const [mode, setMode] = useState<"addLiquidity" | "removeLiquidity">("addLiquidity")


    const pool: Pool = {
        objectId: token.poolId,
        tokenXType: getCoinTypePath(token),
        tokenYType: SUI_COIN_TYPE,
        isStable: false,
    }


    // console.log("baseTokenCoins", baseTokenCoins)
    if (!token) return (<div>Token not found</div>)
    return (<Card>
            <CardHeader>
                <div className={"flex justify-between"}>
                    <Button
                        className={"w-36"}
                        variant={mode === "addLiquidity" ? "default" : "outline"}
                        onClick={() => setMode("addLiquidity")}>
                        Add Liquidity
                    </Button>

                    <Button
                        className={"w-36"}
                        variant={mode === "removeLiquidity" ? "default" : "outline"}
                        onClick={() => setMode("removeLiquidity")}
                        // disabled={userBalance === 0}
                    >
                        Remove Liquidity
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {mode === "addLiquidity" && <AddLiquidityForm coin={token} pool={pool}/>}
            </CardContent>
        </Card>

    )
}