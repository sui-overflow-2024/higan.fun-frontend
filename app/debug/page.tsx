'use client';
import 'react-json-pretty/themes/monikai.css';
import {CoinGetAllKey, coinRestApi} from "@/lib/rest";
import useSWR from "swr";
import {useContextSelector} from "use-context-selector";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import JSONPretty from "react-json-pretty";
import {useCurrentAccount, useSuiClient, useSuiClientContext, useSignTransactionBlock} from "@mysten/dapp-kit";
import {Dex,} from "kriya-dex-sdk";
import {SubmitHandler, useForm} from "react-hook-form";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";
import {FC, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";
import {
    addLiquidity,
    getAllUserCoins,
    getExactCoinByAmount,
    getOptimalLpSwapAmount,
    GetOptimalLpSwapAmount,
    KriyaSwapArgs,
    Pool,
    swap
} from "@/lib/kriya";
import {getLiquidityPoolId} from "@/lib/utils";
import { send } from 'process';
import { sign } from 'crypto';


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
    const {mutateAsync: signTransactionBlock} = useSignTransactionBlock();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<AddLiqForm>({
        defaultValues: {
            pool: {
                objectId: "0x6ca8e3c2f2d3f1bf14e4b96ee5b75b137534a83d19a3e826bab16d4f96137bd8",
                // objectId: "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x2::sui::SUI>",
                tokenXType: "0x56a8b9de60eed3ab8aa7224c87c5fe6b7845355e5ee6b13574ef2981311181e9::canonicus_capillus_amissio::CANONICUS_CAPILLUS_AMISSIO",
                tokenYType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
                isStable: false,
            },
            amountX: BigInt(1_000),
            amountY: BigInt(100000),
            minAddAmountX: BigInt(1000),
            minAddAmountY: BigInt(100000),
            // coinX: "0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb",
            // coinY: "0x0000000000000000000000000000000000000000000000000000000000000002",
            transferToAddress: account?.address || ""
        }
    });
    console.log(account?.address, "address")
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<AddLiqForm> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();
        const lpObject = await addLiquidity({
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

        const signature = await signTransactionBlock({
            transactionBlock: txb,
        });

        const res = await suiClient.executeTransactionBlock({
            transactionBlock: signature.transactionBlockBytes,
            signature: signature.signature,
            sender: account?.address || "",
            getEffects: true,
            gasLimit: 100000000,
            options: {
                showEffects: true,
                showObjectChanges: true,
                JSONPretty: true,
            },
        });

        // const res = await suiClient.executeTransactionBlock({
        //     transactionBlock: txb,
        //     sender: account?.address || "",
        // })
        setRes(res)
        // await sign(txb)
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

    const {register, handleSubmit, formState: {errors}} = useForm<GetOptimalLpSwapAmount & {
        coinX: string,
        coinY: string
    }>({
        defaultValues: {
            poolId: "0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e",
            coinX: `0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO`,
            coinY: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
            inputAmt: BigInt(100_000),
            isStable: false,
            isXtoY: true,
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<GetOptimalLpSwapAmount & { coinX: string, coinY: string }> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();

        const res = await getOptimalLpSwapAmount({
            suiClientCtx,
            poolId: data.poolId,
            inputAmt: data.inputAmt,
            isXtoY: data.isXtoY,
            isStable: data.isStable,
        });
        setRes(res.toString())
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
    const account = useCurrentAccount();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)
    const sign = useTransactionExecution();


    const {register, handleSubmit, formState: {errors}} = useForm<KriyaSwapArgs>({
        defaultValues: {
            pool: {
                objectId: "0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e",
                tokenXType: `0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO`,
                tokenYType: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
                isStable: false,
            },
            inputCoinAmount: BigInt(1_000),
            minReceived: BigInt(0),
            txb: new TransactionBlock(),
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<KriyaSwapArgs> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();
        // const pool = await getLiquidityPoolFields(suiClientCtx, data.pool.objectId,/* data.pool.tokenXType, data.pool.tokenYType*/)
        const allCoinX = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            address: account?.address || "",
            type: data.pool.tokenXType
        })
        const inputCoin = getExactCoinByAmount(data.inputCoinType, allCoinX, data.inputCoinAmount, txb)

        swap({
            kriyaPackageId,
            pool: data.pool,
            inputCoinType: data.pool.tokenXType,
            inputCoinAmount: data.inputCoinAmount,
            inputCoin: inputCoin,
            minReceived: data.minReceived,
            txb,
            transferToAddress: account?.address || "",

        });
        const res = await suiClientCtx.client.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: account?.address || "",
        })
        setRes(res)
        await sign(txb)
    };

    return (<>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label>Pool Id:</label>
                    <Input {...register('pool.tokenXType', {required: true})}/>
                    {errors.pool?.tokenXType && <span>This field is required</span>}
                </div>
                <div>
                    <label>Pool Token X Type:</label>
                    <Input {...register('pool.tokenXType', {required: true})}/>
                    {errors.pool?.tokenXType && <span>This field is required</span>}
                </div>
                <div>
                    <label>Pool Token Y Type:</label>
                    <Input {...register('pool.tokenYType', {required: true})}/>
                    {errors.pool?.tokenYType && <span>This field is required</span>}
                </div>
                <div>
                    <label>Is Stable:</label>
                    <Input type="checkbox" {...register('pool.isStable')}/>
                </div>
                <div>
                    <label>Input Coin Amount:</label>
                    <Input type="number" {...register('inputCoinAmount', {required: true})}
                    />
                    {errors.inputCoinAmount && <span>This field is required</span>}
                </div>
                <div>
                    <label>Minimum Received:</label>
                    <Input type="number" {...register('minReceived', {required: true})}
                    />
                    {errors.minReceived && <span>This field is required</span>}
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
            </form>
            <JSONPretty data={res || {}}/>
        </>
    );
};


type RemoveLiquidityForm = {
    pool: Pool,
    amount: bigint,
    kriyaLpToken: string,
    transferToAddress?: string
}
const GetRemoveLiquidityForm: FC = () => {
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const sign = useTransactionExecution();
    const suiClientCtx = useSuiClientContext();
    const {mutateAsync: signTransactionBlock} = useSignTransactionBlock();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)

    const {register, handleSubmit, formState: {errors}} = useForm<RemoveLiquidityForm>({
        defaultValues: {
            pool: {
                objectId: "0x6ca8e3c2f2d3f1bf14e4b96ee5b75b137534a83d19a3e826bab16d4f96137bd8",
                // objectId: "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x2::sui::SUI>",
                tokenXType: "0x56a8b9de60eed3ab8aa7224c87c5fe6b7845355e5ee6b13574ef2981311181e9::canonicus_capillus_amissio::CANONICUS_CAPILLUS_AMISSIO",
                tokenYType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
                isStable: false,
            },
            amount: BigInt(1_000),
            kriyaLpToken: "0xbf7d26e0cbe263de17b22d919d146f5545b72f7e042c023bf9fb6cd8f2d234da",
            transferToAddress: account?.address || ""
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<RemoveLiquidityForm> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new TransactionBlock();

        removeLiquidity(
            kriyaPackageId,
            data.pool,
            BigInt(data.amount),
            data.kriyaLpToken,
            txb,
            account?.address || "",
        );
        const signature = await signTransactionBlock({
            transactionBlock: txb,
        });

        const res = await suiClient.executeTransactionBlock({
            transactionBlock: signature.transactionBlockBytes,
            signature: signature.signature,
            sender: account?.address || "",
            getEffects: true,
            gasLimit: 100000000,
            options: {
                showEffects: true,
                showObjectChanges: true,
                JSONPretty: true,
            },
        });
        setRes(res)
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
                <div>Amount:</div>
                <Input type="number" {...register('amount', {required: true})} />
                {errors.amount && <span>This field is required</span>}
            </div>
            <div className={"flex gap-4"}>
                <div>Kriya LP TOKEN:</div>
                <Input type="string" {...register('kriyaLpToken', {required: true})} />
                {errors.kriyaLpToken && <span>This field is required</span>}
            </div>
            <div className={"flex gap-4"}>
                <div>Transfer To Address (optional):</div>
                <Input {...register('transferToAddress')} />
            </div>
            <Button type="submit">Remove Liquidity</Button>
        </form>
        <JSONPretty data={res || {}}/>
    </>
);
};

export default function DebugPage() {

    const axios = useContextSelector(AppConfigContext, (context) => context.axios);
    const {data: allCoins, error} = useSWR<CoinFromRestAPI[], any, CoinGetAllKey>({
        axios,
        limit: 1000,
        order: "desc",
        path: "getAll"
    }, coinRestApi.getAll, {refreshInterval: 10000})
    // const {register, handleSubmit} = useForm<Parameters<Dex["addLiquidity"]>>({

    return (<div>
        {/*<h2 className={"text-xl"}>AppConfig</h2>*/}
        {/*<JSONPretty data={appConfig || {}}/>*/}
        <h2>Add Liquidity</h2>
        <AddLiqFormComponent/>
        <p className={"text-xl"}>Get Optimal Lp Swap Amount</p>
        <GetOptimalLpSwapAmountForm/>
        <p className={"text-xl"}>Swap Form</p>
        <SwapForm/>
        <h2 className={"text-xl"}>All Coins</h2>
        <JSONPretty data={allCoins || {}}/>
        <h2>Remove Liquidity</h2>
        <GetRemoveLiquidityForm />
    </div>)

}
