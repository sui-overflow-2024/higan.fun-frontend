'use client';
import 'react-json-pretty/themes/monikai.css';
import {CoinGetAllKey, coinRestApi} from "@/lib/rest";
import useSWR from "swr";
import {useContextSelector} from "use-context-selector";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import JSONPretty from "react-json-pretty";
import {useCurrentAccount, useSuiClient, useSuiClientContext} from "@mysten/dapp-kit";
import {Dex,} from "kriya-dex-sdk";
import {SubmitHandler, useForm} from "react-hook-form";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";
import {FC, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";
import {addLiquidity, getOptimalLpSwapAmount, GetOptimalLpSwapAmount, Pool} from "@/lib/kriya";
import {getLiquidityPoolId} from "@/lib/utils";


// const DemoSingleCoin: FC<{ packageId: string }> = ({packageId}) => {
//     const {data, isLoading, isError, error} = useFetchCoinFromRest({packageId})
//
//     // useFetchManyCoinsFromRest with packageIds filter on the packageId param
//     const {
//         data: data2,
//         isLoading: isLoading2,
//         isError: isError2,
//         error: error2
//     } = useFetchManyCoinsFromRest({packageIds: [packageId]})
//
//     if (isLoading) return <div>Loading...</div>
//     if (isError) return <div>Error: {(error as Error).message}</div>
//
//     return <div>
//         <p className={"text-xl bg-white"}>Single Coin {packageId}</p>
//         <JSONPretty data={data || {}}/>
//         <p className={"text-xl bg-white"}>Filter many with filter on {packageId}</p>
//         <JSONPretty data={data2 || {}}/>
//     </div>
// }

//1. splitCoin on coin amount passed here for both coins
//2. support addLiquidityOneSided as default, because it's easier
//3. How to display the LP token price on the app
//4. Support removing liquidity
//5. How to rewire Buy/Sell dialog to allow adding and removing liqudity


// Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb }
type AddLiqForm = {
    pool: Pool,
    amountX: bigint,
    amountY: bigint,
    minAddAmountX: bigint,
    minAddAmountY: bigint,
    coinX: string | TransactionArgument,
    coinY: string | TransactionArgument,
    txb: TransactionBlock,
    transferToAddress?: string
    // pool: {
    //     objectId: string,
    //     tokenXType: string,
    //     tokenYType: string,
    //     isStable?: boolean,
    // },
    // amountX: bigint | TransactionArgument,
    // amountY: bigint | TransactionArgument,
    // minAddAmountX: bigint
    // coinX: `${string}::${string}::${string}`,
    // coinY: `${string}::${string}::${string}`,
    // txb: TransactionBlock,
    // minReceived: bigint,
    // inputCoinAmount: number,
    // transferToAddress?: string,
}


const AddLiqFormComponent: FC = () => {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const sign = useTransactionExecution();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<AddLiqForm>({
        defaultValues: {
            pool: {
                objectId: "0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e",
                // objectId: "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x2::sui::SUI>",
                tokenXType: "0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO",
                tokenYType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
                isStable: false,
            },
            amountX: BigInt(1_000),
            amountY: BigInt(0),
            minAddAmountX: BigInt(0),
            minAddAmountY: BigInt(0),
            // coinX: "0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb",
            // coinY: "0x0000000000000000000000000000000000000000000000000000000000000002",
            transferToAddress: account?.address || ""
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<AddLiqForm> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();
        const lpObject = addLiquidity({
            kriyaPackageId,
            account,
            suiClient,
            pool: data.pool,
            amountX: data.amountX,
            amountY: data.amountY,
            minAddAmountX: data.minAddAmountX,
            minAddAmountY: data.minAddAmountY,
            txb,
            transferToAddress: account?.address || ""
        });
        const res = await suiClient.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: account?.address || "",
        })
        setRes(res)
        await sign(txb)
    };

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-2 w-96"}>
                <div className={"flex gap-4"}>
                    <div>Pool Object ID:</div>
                    <Input {...register('pool.objectId', {required: true})} />
                    {errors.pool?.objectId && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Pool Token X Type:</div>
                    <Input {...register('pool.tokenXType', {required: true})} />
                    {errors.pool?.tokenXType && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Pool Token Y Type:</div>
                    <Input {...register('pool.tokenYType', {required: true})} />
                    {errors.pool?.tokenYType && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Is Stable:</div>
                    <Input type="checkbox" {...register('pool.isStable')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Amount X:</div>
                    <Input type="number" {...register('amountX', {required: true})} />
                    {errors.amountX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Amount Y:</div>
                    <Input type="number" {...register('amountY', {required: true})} />
                    {errors.amountY && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Min Add Amount X:</div>
                    <Input type="number" {...register('minAddAmountX', {required: true})} />
                    {errors.minAddAmountX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Min Add Amount Y:</div>
                    <Input type="number" {...register('minAddAmountY', {required: true})} />
                    {errors.minAddAmountY && <span>This field is required</span>}
                </div>
                {/*<div className={"flex gap-4"}>*/}
                {/*    <div>Coin X:</div>*/}
                {/*    <Input {...register('coinX', {required: true})} />*/}
                {/*    {errors.coinX && <span>This field is required</span>}*/}
                {/*</div>*/}
                {/*<div className={"flex gap-4"}>*/}
                {/*    <div>Coin Y:</div>*/}
                {/*    <Input {...register('coinY', {required: true})} />*/}
                {/*    {errors.coinY && <span>This field is required</span>}*/}
                {/*</div>*/}
                <div className={"flex gap-4"}>
                    <div>Transfer To Address (optional):</div>
                    <Input {...register('transferToAddress')} />
                </div>
                <Button type="submit">Add Liquidity</Button>
            </form>
            <JSONPretty data={res || {}}/>
        </>
    );
};

const G: FC = () => {
    const account = useCurrentAccount();
    const suiClient = useSuiClient();
    const sign = useTransactionExecution();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<AddLiqForm>({
        defaultValues: {
            pool: {
                objectId: "0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e",
                // objectId: "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x2::sui::SUI>",
                tokenXType: "0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO",
                tokenYType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
                isStable: false,
            },
            amountX: BigInt(1_000),
            amountY: BigInt(0),
            minAddAmountX: BigInt(0),
            minAddAmountY: BigInt(0),
            // coinX: "0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb",
            // coinY: "0x0000000000000000000000000000000000000000000000000000000000000002",
            transferToAddress: account?.address || ""
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<AddLiqForm> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();
        const lpObject = addLiquidity({
            kriyaPackageId,
            account,
            suiClient,
            pool: data.pool,
            amountX: data.amountX,
            amountY: data.amountY,
            minAddAmountX: data.minAddAmountX,
            minAddAmountY: data.minAddAmountY,
            txb,
            transferToAddress: account?.address || ""
        });
        const res = await suiClient.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: account?.address || "",
        })
        setRes(res)
        await sign(txb)
    };

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-2 w-96"}>
                <div className={"flex gap-4"}>
                    <div>Pool Object ID:</div>
                    <Input {...register('pool.objectId', {required: true})} />
                    {errors.pool?.objectId && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Pool Token X Type:</div>
                    <Input {...register('pool.tokenXType', {required: true})} />
                    {errors.pool?.tokenXType && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Pool Token Y Type:</div>
                    <Input {...register('pool.tokenYType', {required: true})} />
                    {errors.pool?.tokenYType && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Is Stable:</div>
                    <Input type="checkbox" {...register('pool.isStable')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Amount X:</div>
                    <Input type="number" {...register('amountX', {required: true})} />
                    {errors.amountX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Amount Y:</div>
                    <Input type="number" {...register('amountY', {required: true})} />
                    {errors.amountY && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Min Add Amount X:</div>
                    <Input type="number" {...register('minAddAmountX', {required: true})} />
                    {errors.minAddAmountX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Min Add Amount Y:</div>
                    <Input type="number" {...register('minAddAmountY', {required: true})} />
                    {errors.minAddAmountY && <span>This field is required</span>}
                </div>
                {/*<div className={"flex gap-4"}>*/}
                {/*    <div>Coin X:</div>*/}
                {/*    <Input {...register('coinX', {required: true})} />*/}
                {/*    {errors.coinX && <span>This field is required</span>}*/}
                {/*</div>*/}
                {/*<div className={"flex gap-4"}>*/}
                {/*    <div>Coin Y:</div>*/}
                {/*    <Input {...register('coinY', {required: true})} />*/}
                {/*    {errors.coinY && <span>This field is required</span>}*/}
                {/*</div>*/}
                <div className={"flex gap-4"}>
                    <div>Transfer To Address (optional):</div>
                    <Input {...register('transferToAddress')} />
                </div>
                <Button type="submit">Add Liquidity</Button>
            </form>
            <JSONPretty data={res || {}}/>
        </>
    );
};

const GetOptimalLpSwapAmountForm: FC = () => {
    const suiClientCtx = useSuiClientContext();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)

    const {register, handleSubmit, formState: {errors}} = useForm<GetOptimalLpSwapAmount & {coinX: string, coinY: string}>({
        defaultValues: {
            coinX: `0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO`,
            coinY: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
            inputAmt: BigInt(100_000),
            isStable: false,
            isXtoY: true,
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<GetOptimalLpSwapAmount & {coinX: string, coinY: string}> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();

        const res = await getOptimalLpSwapAmount({
            suiClientCtx,
            poolId: getLiquidityPoolId(kriyaPackageId, data.coinX, data.coinY),
            inputAmt: data.inputAmt,
            isXtoY: data.isXtoY,
            isStable: data.isStable,
        });
        setRes(res)
    };

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-2 w-96"}>
                <div className={"flex gap-4"}>
                    <div>Coin X:</div>
                    <Input {...register('coinX', {required: true})} />
                    {errors.coinX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Coin Y:</div>
                    <Input {...register('coinY', {required: true})} />
                    {errors.coinY && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Is Stable?:</div>
                    <Input type="checkbox" {...register('isStable')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Is X to Y?:</div>
                    <Input type="checkbox" {...register('isXtoY')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Is X to Y?:</div>
                    <Input type="number" {...register('inputAmt', {required: true})} />
                </div>
                <Button type="submit">Get Optimal LP Swap Price</Button>
            </form>
            <JSONPretty data={res || {}}/>
        </>
    );
};


const SwapForm: FC = () => {
    const suiClientCtx = useSuiClientContext();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)

    const {register, handleSubmit, formState: {errors}} = useForm<GetOptimalLpSwapAmount & {coinX: string, coinY: string}>({
        defaultValues: {
            coinX: `0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO`,
            coinY: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
            inputAmt: BigInt(100_000),
            isStable: false,
            isXtoY: true,
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<GetOptimalLpSwapAmount & {coinX: string, coinY: string}> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();

        const res = await getOptimalLpSwapAmount({
            suiClientCtx,
            poolId: getLiquidityPoolId(kriyaPackageId, data.coinX, data.coinY),
            inputAmt: data.inputAmt,
            isXtoY: data.isXtoY,
            isStable: data.isStable,
        });
        setRes(res)
    };

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className={"space-y-2 w-96"}>
                <div className={"flex gap-4"}>
                    <div>Coin X:</div>
                    <Input {...register('coinX', {required: true})} />
                    {errors.coinX && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Coin Y:</div>
                    <Input {...register('coinY', {required: true})} />
                    {errors.coinY && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Is Stable?:</div>
                    <Input type="checkbox" {...register('isStable')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Is X to Y?:</div>
                    <Input type="checkbox" {...register('isXtoY')} />
                </div>
                <div className={"flex gap-4"}>
                    <div>Is X to Y?:</div>
                    <Input type="number" {...register('inputAmt', {required: true})} />
                </div>
                <Button type="submit">Get Optimal LP Swap Price</Button>
            </form>
            <JSONPretty data={res || {}}/>
        </>
    );
};

export default function DebugPage() {
    const ctx = useSuiClientContext()
    const account = useCurrentAccount()
    const rpcUrl = ctx.config?.url || "";
    const dex = new Dex(rpcUrl)


    console.log("ctx", ctx)
    // {
    //     axios: Axios,
    //         packageIds?: string[],
    //         creator?: string,
    //         limit?: number,
    //         order?: "asc" | "desc",
    //         path: "getAll"
    // }

    const axios = useContextSelector(AppConfigContext, (context) => context.axios);
    const {data: allCoins, error} = useSWR<CoinFromRestAPI[], any, CoinGetAllKey>({
        axios,
        limit: 1000,
        order: "desc",
        path: "getAll"
    }, coinRestApi.getAll, {refreshInterval: 10000})
    // const {register, handleSubmit} = useForm<Parameters<Dex["addLiquidity"]>>({


    const submitForm = (data: Parameters<Dex["addLiquidity"]>) => {
        const addLiq = async () => {
            const txb = dex.addLiquidity(...data)
        }
    }
    // const {
    //     register: addInitLiq,
    //     formState: {errors: addInitLiqErrors},
    //     handleSubmit: addInitLiqSubmit
    // } = useForm<InitLiqForm>({
    //     defaultValues: {
    //         adminCapId: "",
    //         bondingCurveId: "",
    //         poolId: ""
    //     }
    // });
    //
    //
    // const submitAddLiquality = async (data: InitLiqForm) => {
    //     console.log("submitAddLiquality", data)
    //     const txb = new TransactionBlock()
    //     txb.moveCall()

    // const getTheLiquidity = new TransactionBlock()
    //
    //
    // const txb2 = new TransactionBlock()
    // txb2.moveCall({
    //     target: `${config.managementPackageId}::manager_contract::add_initial_liquidity`,
    //     arguments: [
    //         txb2.object(config.managementAdminCapId),
    //         txb2.object(bonding_curve_id),
    //         txb2.object(pool),
    //     ],
    //     typeArguments: [
    //         `${coin.packageId}::${coin.module}::${coin.module.toUpperCase()}`,
    //     ],
    // });
    //
    // const deliciousLiquidity = await client.signAndExecuteTransactionBlock({
    //     signer: keypair,
    //     transactionBlock: txb2,
    //     options: {
    //         showBalanceChanges: true,
    //         showEffects: true,
    //         showEvents: true,
    //         showInput: true,
    //         showObjectChanges: true,
    //     },
    // });
    // console.log("deliciousLiquidity", deliciousLiquidity)
    // }
    // const getLiquality = async () => {
    //     const txb = new TransactionBlock()
    //     txb.moveCall({
    //         target: `${config.managementPackageId}::manager_contract::get_initial_liquidity`,
    //         arguments: [
    //             txb.object(config.managementAdminCapId),
    //             txb.object(bonding_curve_id),
    //             txb.object(pool),
    //         ],
    //         typeArguments: [
    //             `${coin.packageId}::${coin.module}::${coin.module.toUpperCase()}`,
    //         ],
    //     });
    //
    //     const deliciousLiquidity = await client.signAndExecuteTransactionBlock({
    //         signer: keypair,
    //         transactionBlock: txb,
    //         options: {
    //             showBalanceChanges: true,
    //             showEffects: true,
    //             showEvents: true,
    //             showInput: true,
    //             showObjectChanges: true,
    //         },
    //     });
    //     console.log("deliciousLiquidity", deliciousLiquidity)
// }

    return (<div>
        {/*<h2 className={"text-xl"}>AppConfig</h2>*/}
        {/*<JSONPretty data={appConfig || {}}/>*/}
        <h2>Add Liquidity</h2>
        <AddLiqFormComponent/>
        <p className={"text-xl"}>Get Optimal Lp Swap Amount</p>
        <GetOptimalLpSwapAmountForm/>
        <h2 className={"text-xl"}>All Coins</h2>
        <JSONPretty data={allCoins || {}}/>
    </div>)

}
