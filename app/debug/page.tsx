'use client';
import 'react-json-pretty/themes/monikai.css';
import {CoinGetAllKey, coinRestApi} from "@/lib/rest";
import useSWR from "swr";
import {useContextSelector} from "use-context-selector";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import JSONPretty from "react-json-pretty";
import {useCurrentAccount, useSignTransaction, useSuiClient, useSuiClientContext} from "@mysten/dapp-kit";
import {SubmitHandler, useForm} from "react-hook-form";
import {Transaction, TransactionArgument} from "@mysten/sui/transactions";
import {FC, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useTransactionExecution} from "@/hooks/useTransactionExecution";
import {
    addLiquidity,
    addLiquiditySingleSided,
    AddLiquiditySingleSidedArgs,
    getAllUserCoins,
    getExactCoinByAmount,
    getOptimalLpSwapAmount,
    GetOptimalLpSwapAmount,
    KriyaSwapArgs,
    Pool,
    removeLiquidity,
    swap
} from "@/lib/kriya";


// Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb }
type AddLiqForm = {
    pool: Pool,
    amountX: bigint,
    amountY: bigint,
    minAddAmountX: bigint,
    minAddAmountY: bigint,
    coinX: string | TransactionArgument,
    coinY: string | TransactionArgument,
    txb: Transaction,
    transferToAddress?: string
}


const AddLiqFormComponent: FC = () => {
    const account = useCurrentAccount();
    const suiClientCtx = useSuiClientContext();
    const sign = useTransactionExecution();
    const {mutateAsync: signTransactionBlock} = useSignTransaction();
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

        const txb = new Transaction();
        const allCoinX = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            type: data.pool.tokenXType,
            address: account?.address || "",
        });
        const coinX = getExactCoinByAmount(data.pool.tokenXType, allCoinX, data.amountX, txb)

        const allCoinY = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            type: data.pool.tokenXType,
            address: account?.address || "",
        });
        const coinY = getExactCoinByAmount(data.pool.tokenYType, allCoinY, data.amountY, txb)

        const lpObject = await addLiquidity({
            kriyaPackageId,
            account,
            suiClient: suiClientCtx.client,
            pool: data.pool,
            amountX: data.amountX,
            amountY: data.amountY,
            minAddAmountX: data.minAddAmountX,
            minAddAmountY: data.minAddAmountY,
            coinX,
            coinY,
            txb,
            transferToAddress: account?.address || ""
        });

        const signature = await signTransactionBlock({
            transactionBlock: txb,
        });

        const res = await suiClientCtx.client.executeTransactionBlock({
            transactionBlock: signature.transactionBlockBytes,
            signature: signature.signature,
            options: {
                showEffects: true,
                showObjectChanges: true,
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


const AddLiqFormSingleComponent: FC = () => {
    const account = useCurrentAccount();
    const suiClientCtx = useSuiClientContext();
    const sign = useTransactionExecution();
    const {mutateAsync: signTransactionBlock} = useSignTransaction();
    const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
    const [res, setRes] = useState<any>(null)
    const {register, handleSubmit, formState: {errors}} = useForm<AddLiquiditySingleSidedArgs>({
        defaultValues: {
            pool: {
                objectId: "0x6ca8e3c2f2d3f1bf14e4b96ee5b75b137534a83d19a3e826bab16d4f96137bd8",
                // objectId: "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x2::sui::SUI>",
                tokenXType: "0x56a8b9de60eed3ab8aa7224c87c5fe6b7845355e5ee6b13574ef2981311181e9::canonicus_capillus_amissio::CANONICUS_CAPILLUS_AMISSIO",
                tokenYType: "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI",
                isStable: false,
            },
            inputCoinType: "0x56a8b9de60eed3ab8aa7224c87c5fe6b7845355e5ee6b13574ef2981311181e9::canonicus_capillus_amissio::CANONICUS_CAPILLUS_AMISSIO",
            inputCoinAmount: BigInt(1_000),
            swapSlippageTolerance: 0.95,
            transferToAddress: account?.address || ""
        }
    });
    console.log(account?.address, "address")
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<AddLiquiditySingleSidedArgs> = async (data) => {
        const txb = new Transaction();
        console.log("data", data)

        const inputCoins = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            type: data.inputCoinType,
            address: account?.address || "",
        });

        const inputCoinSplit = getExactCoinByAmount(data.inputCoinType, inputCoins, data.inputCoinAmount, txb)
        const lpObject = await addLiquiditySingleSided({
            kriyaPackageId,
            account,
            suiClientCtx,
            pool: data.pool,
            inputCoinType: data.inputCoinType,
            inputCoin: inputCoinSplit,
            inputCoinAmount: data.inputCoinAmount,
            swapSlippageTolerance: data.swapSlippageTolerance,
            txb,
            transferToAddress: account?.address || ""
        });


        const res = await suiClientCtx.client.devInspectTransactionBlock({
            transactionBlock: txb,
            sender: account?.address || "",
        })
        setRes(res)
        const signature = await signTransactionBlock({
            transactionBlock: txb,
        });

        const res2 = await suiClientCtx.client.executeTransactionBlock({
            transactionBlock: signature.transactionBlockBytes,
            signature: signature.signature,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        console.log("res2", res2)
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
                    <div>Input Coin Type:</div>
                    <Input {...register('inputCoinType', {required: true})} />
                    {errors.inputCoinType && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Input Coin Amount:</div>
                    <Input type="number" {...register('inputCoinAmount', {required: true})} />
                    {errors.inputCoinAmount && <span>This field is required</span>}
                </div>
                <div className={"flex gap-4"}>
                    <div>Is Stable:</div>
                    <Input type="checkbox" {...register('pool.isStable')} />
                </div>
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
        const txb = new Transaction();

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
                objectId: "0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e", //rest api
                tokenXType: `0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO`, //getCoinTypePath(restApiToken) packageId::module::MODULE
                tokenYType: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
                isStable: false,
            },
            inputCoinAmount: BigInt(1_000),
            minReceived: BigInt(0),
            txb: new Transaction(),
        }
    });
    // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }

    const onSubmit: SubmitHandler<KriyaSwapArgs> = async (data) => {
        console.log("data", data)
        // Handle the form data submission
        console.log(data);
        const txb = new Transaction();
        // const pool = await getLiquidityPoolFields(suiClientCtx, data.pool.objectId,/* data.pool.tokenXType, data.pool.tokenYType*/)
        const allCoinX = await getAllUserCoins({
            suiClient: suiClientCtx.client,
            address: account?.address || "",
            type: data.pool.tokenXType
        })
        const inputCoin = getExactCoinByAmount(data.inputCoinType, allCoinX, data.inputCoinAmount, txb)

        swap({
            kriyaPackageId,
            account,
            pool: data.pool,
            inputCoinType: data.pool.tokenXType, //buy? SUI, sell: CustomToken
            inputCoinAmount: data.inputCoinAmount, // Amount user puts into the form
            inputCoin: inputCoin, // getAllUserCoins -> getExactCoinByAmount
            minReceived: data.minReceived, // 0.97 * inputCoinAmount
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
    const {mutateAsync: signTransactionBlock} = useSignTransaction();
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
        const txb = new Transaction();

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
            options: {
                showEffects: true,
                showObjectChanges: true,
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
        <p className={"text-xl"}>Add Liquidity Single Sided</p>
        <AddLiqFormSingleComponent/>
        <p className={"text-xl"}>Get Optimal Lp Swap Amount</p>
        <GetOptimalLpSwapAmountForm/>
        <p className={"text-xl"}>Swap Form</p>
        <SwapForm/>
        <h2 className={"text-xl"}>All Coins</h2>
        <JSONPretty data={allCoins || {}}/>
        <h2>Remove Liquidity</h2>
        <GetRemoveLiquidityForm/>
    </div>)

}
