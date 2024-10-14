'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {FC, useEffect, useState} from "react";
import {getCoinTypePath} from "@/lib/utils";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import {SuiClientProviderContext, useCurrentAccount, useSuiClientContext, useSuiClientQuery} from "@mysten/dapp-kit";
import {TransactionBlock,} from "@mysten/sui/transactions";
import {SubmitHandler, useForm} from "react-hook-form";
import {useToast} from "@/components/ui/use-toast";
import {useContextSelector} from "use-context-selector";
import {addLiquidity, getAllUserCoins, getExactCoinByAmount, getOptimalLpSwapAmount, Pool} from "@/lib/kriya";
import {SUI_COIN_TYPE} from "@/lib/config";
import {Input} from "@/components/ui/input";
import {useTransactionExecution} from "@/hooks/useTransactionExecution";
import {Dex} from "kriya-dex-sdk";
import useSWR from "swr";

type AddLiqForm = {
    amountX: bigint,
    amountY: bigint,
    txb: TransactionBlock,
    transferToAddress?: string
}
type FetchReservesKey = { suiClientCtx: SuiClientProviderContext, pool: Pool }
type TokenReserveResponse = { xReserve: BigInt, yReserve: BigInt }

const getTokenReserves = async ({suiClientCtx, pool}: FetchReservesKey): Promise<TokenReserveResponse> => {
    const dex = new Dex(suiClientCtx.config?.url || "https://fullnode.mainnet.sui.io:443")
    console.log("poolId", pool.objectId)
    const txn = await dex.suiClient.getObject({
        id: pool.objectId,
        options: {showContent: true},
    });
    // @ts-ignore
    const xReserve = BigInt(txn.data?.content.fields.token_x)
    // @ts-ignore
    const yReserve = BigInt(txn.data?.content.fields.token_y);
    return {xReserve, yReserve}
}

const AddLiquidityForm: FC<{ coin: CoinFromRestAPI, pool: Pool }> = ({coin, pool}) => {
    const {toast} = useToast()
    const account = useCurrentAccount()
    const kriyaPackageId = useContextSelector(AppConfigContext, v => v.kriyaPackageId)
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
    const amountY = watch('amountY'); //Coin is always SUI

    const sign = useTransactionExecution()
    const {data: memeBalance, refetch: refetchMeme} = useSuiClientQuery("getBalance", {
        owner: account?.address || "",
        coinType: getCoinTypePath(coin)
    })

    const {data: suiBalance, refetch: refetchSui} = useSuiClientQuery("getBalance", {
        owner: account?.address || "",
        coinType: SUI_COIN_TYPE,
    })

    const {data: poolReserves, mutate: refetchReserves} = useSWR<TokenReserveResponse, any, FetchReservesKey>({
        suiClientCtx,
        pool
    }, getTokenReserves)


    useEffect(() => {
        const fetchOptimalY = async () => {
            console.log("lastInputState in post X", lastInputState)
            console.log("poolReserves", poolReserves)
            if (poolReserves?.xReserve === BigInt(0) || poolReserves?.yReserve === BigInt(0)) {
                console.log("Pool is new without any existing input. Allow whatever.")
                return
            }
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
    }, [amountX, lastInputState, memeBalance, pool.objectId, poolReserves, setValue, suiBalance, suiClientCtx]);

    useEffect(() => {
        console.log("lastInputState in post Y", lastInputState)
        if (poolReserves?.xReserve === BigInt(0) || poolReserves?.yReserve === BigInt(0)) {
            console.log("Pool is new without any existing input. Allow whatever.")
            return
        }
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
    }, [amountX, amountY, coin.symbol, lastInputState, memeBalance, memeBalance.totalBalance, pool.objectId, poolReserves?.xReserve, poolReserves?.yReserve, setValue, suiBalance, suiBalance.totalBalance, suiClientCtx]);


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
        await refetchReserves()

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

export const AddRemoveLiquidityDialog: FC<{
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