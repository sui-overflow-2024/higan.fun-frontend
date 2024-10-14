'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {FC, useEffect, useState} from "react";
import {getCoinTypePath, getManagerFuncPath, getValueWithDecimals, truncateDecimals} from "@/lib/utils";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI, CoinStatus} from "@/lib/types";
import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {Transaction,} from "@mysten/sui/transactions";
import type {CoinStruct, SuiClient} from '@mysten/sui/client';
import {useForm} from "react-hook-form";
import {customSuiHooks, TokenMetric} from "@/lib/sui";
import {useTransactionExecution} from "@/hooks/useTransactionExecution";
import useSWR, {mutate} from "swr";
import {useToast} from "@/components/ui/use-toast";
import {useContextSelector} from "use-context-selector";
import {getAllUserCoins, getExactCoinByAmount} from "@/lib/kriya";


const generateBuyPtb = (managerContractPackageId: string, managerContractModuleName: string, coin: CoinFromRestAPI, amountToBuy: number) => {
    console.log("Attempting to buy ", amountToBuy, "of", coin.symbol, "packageId", coin.packageId, "bondingCurveId", coin.bondingCurveId, "module", coin.module, "decimals", coin.decimals)
    if (amountToBuy <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }


    const txb = new Transaction();
    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    const splitCoin = txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_coin_buy_price"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.pure(amountToBuy),
        ],
        typeArguments: [getCoinTypePath(coin)]
    })
    const [payment] = txb.splitCoins(txb.gas, [txb.object(splitCoin)]);

    // txb.transferObjects([payment], "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501")
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "buy_coins"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.object(payment),
            txb.pure(amountToBuy),
        ],
        typeArguments: [getCoinTypePath(coin)]
    });
    return txb
}

const generateSellPtb = (managerContractPackageId: string, managerContractModuleName: string, coin: CoinFromRestAPI, userCoins: CoinStruct[], amountToSell: number): Transaction => {
    console.log("Attempting to sell ", amountToSell, "of", coin.symbol, "packageId", coin.packageId, "bondingCurveId", coin.bondingCurveId, "module", coin.module, "decimals", coin.decimals)
    if (amountToSell <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }

    const txb = new Transaction();
    const exactCoinByAmount = getExactCoinByAmount(getCoinTypePath(coin), userCoins, BigInt(amountToSell), txb)

    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "sell_coins"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.object(exactCoinByAmount),
        ],
        typeArguments: [getCoinTypePath(coin)]
    });
    return txb;
}

export const getBuyCoinPriceTxb = (managerContractPackageId: string, managerContractModuleName: string, coinType: string, bondingCurveId: string, amount: number): Transaction => {
    console.log("getBuyCoinPriceTxb", managerContractPackageId, managerContractModuleName, coinType, bondingCurveId, amount)
    const txb = new Transaction()
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_coin_buy_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(bondingCurveId),
            txb.pure(amount),
        ],
        typeArguments: [coinType]
    })
    return txb
}
export const getSellCoinPriceTxb = (managerContractPackageId: string, managerContractModuleName: string, coinType: string, bondingCurveId: string, amount: number): Transaction => {
    console.log("getSellCoinPriceTxb", managerContractPackageId, managerContractModuleName, coinType, bondingCurveId, amount)
    const txb = new Transaction()
    txb.moveCall({
        target: getManagerFuncPath(managerContractPackageId, managerContractModuleName, "get_coin_sell_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(bondingCurveId),
            txb.pure(amount),
        ],
        typeArguments: [coinType]
    })
    return txb
}


export const BuySellDialog: FC<{
    token: CoinFromRestAPI,
    tokenMetrics: TokenMetric,
    suiClient: SuiClient
}> = ({token, tokenMetrics, suiClient}) => {
    const axios = useContextSelector(AppConfigContext, (v) => v.axios);
    const fallbackDevInspectAddress = useContextSelector(AppConfigContext, (v) => v.fallbackDevInspectAddress);
    const managerContractPackageId = useContextSelector(AppConfigContext, (v) => v.managerContractPackageId);
    const managerContractModuleName = useContextSelector(AppConfigContext, (v) => v.managerContractModuleName);
    const socket = useContextSelector(AppConfigContext, (v) => v.socket);
    const currentAccount = useCurrentAccount()
    const executeTranscation = useTransactionExecution()
    const [mode, setMode] = useState<"buy" | "sell">("buy")
    const [userBalance, setUserBalance] = useState(0)
    const [userSuiBalance, setUserSuiBalance] = useState(0)
    const [baseTokenCoins, setBaseTokenCoins] = useState<CoinStruct[]>([])
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const {toast} = useToast()
    const {register, handleSubmit, watch, formState: {errors,}, reset} = useForm<{
        amount: number
    }>({
        defaultValues: {
            amount: 1
        }
    });
    const multiplier = (token?.decimals || 0) > 0 ? Math.pow(10, token?.decimals || 0) : 1
    const amount = watch("amount") * multiplier

    useEffect(() => {
        const fetchBalance = async () => {
            if (!token) return
            if (!currentAccount?.address) return
            if (!suiClient) return

            console.log("fetching balance for", currentAccount?.address, "token", getCoinTypePath(token))
            const balance = await suiClient.getBalance({
                owner: currentAccount.address,
                coinType: getCoinTypePath(token),
            })
            const suiBalance = await suiClient.getBalance({
                owner: currentAccount.address,
            });

            setUserSuiBalance(parseInt(suiBalance.totalBalance || "0"));
            setUserBalance(parseInt(balance.totalBalance))

            const coins = await getAllUserCoins({
                suiClient: suiClient,
                type: getCoinTypePath(token),
                address: currentAccount.address,
            });

            console.log("coins", coins)
            setBaseTokenCoins(coins)
        }
        fetchBalance()
    }, [token, currentAccount?.address, suiClient, amount, userBalance, userSuiBalance, currentAccount])

    const {data: coinPrice, isLoading: isLoadingCoinPrice, error: coinPriceError, mutate: refetchCoinPrice} = useSWR({
        managerContractPackageId,
        managerContractModuleName,
        suiClient,
        sender: currentAccount?.address || fallbackDevInspectAddress,
        coinType: getCoinTypePath(token),
        bondingCurveId: token.bondingCurveId,
        amount,
        mode
    }, customSuiHooks.getCurrentCoinPriceInSui, {refreshInterval: 5000})

    useEffect(() => {
        socket.on('tradeCreated', async (data) => {
            if (data.coin.bondingCurveId === token.bondingCurveId) {
                console.log("trade impacting this coin created, refetching the coin price")
                await refetchCoinPrice()
            }
        });
    }, [refetchCoinPrice, socket, token.bondingCurveId]);

    // Set error message on specific state updates
    useEffect(() => {
        if (isLoadingCoinPrice) {
            setErrorMessage(null)
            // return
        }

        if (mode === "sell" && userBalance < amount) {
            setErrorMessage("You don't have enough tokens to sell");
            return
        }

        if (mode == "sell" && tokenMetrics.totalSupply < amount) {
            setErrorMessage("Not enough liquidity");
            return
        }

        if (mode === "buy" && currentAccount && coinPrice && userSuiBalance < coinPrice) {
            setErrorMessage("Not enough balance to buy");
            return
        }

        if (isNaN(amount)) {
            setErrorMessage("Amount must be higher than 0")
            return
        }

        setErrorMessage(null)
    }, [tokenMetrics.totalSupply, mode, userBalance, userSuiBalance, amount, coinPrice, currentAccount, isLoadingCoinPrice])


    const submit = async (data: { amount: number }) => {
        console.log(`${mode}ing ${data.amount} of the token now`)

        const price = await customSuiHooks.getCurrentCoinPriceInSui({
            managerContractPackageId,
            managerContractModuleName,
            suiClient,
            sender: currentAccount?.address || fallbackDevInspectAddress,
            coinType: getCoinTypePath(token),
            bondingCurveId: token.bondingCurveId,
            amount,
            mode
        })

        if (mode === "buy" && userSuiBalance < price) {
            toast({
                title: "Insufficient Sui balance",
                duration: 3000,
                variant: "destructive",
                description: "Insufficient Sui balance",
            });

            return
        }

        const txb = mode === "buy"
            ? generateBuyPtb(managerContractPackageId, managerContractModuleName, token, amount)
            : generateSellPtb(managerContractPackageId, managerContractModuleName, token, baseTokenCoins, amount);

        await executeTranscation(txb)
        // TODO you can refresh trades.ts and your own balance here

        await mutate({
            client: suiClient,
            sender: "0xbd81e46b4f6c750606445c10eccd486340ac168c9b34e4c4ab587fac447529f5",
            coin: token,
            path: "tokenMetrics",
        })
        await mutate({axios, packageId: token.packageId, path: "getHolders"})

        reset({amount: 1})
    }
    // console.log("baseTokenCoins", baseTokenCoins)
    if (!token) return (<div>Token not found</div>)
    return (<Card>
            <CardHeader>
                <div className={"flex justify-between"}>
                    <Button
                        className={"w-36"}
                        variant={mode === "buy" ? "default" : "outline"}
                        onClick={() => setMode("buy")}>
                        Buy
                    </Button>

                    <Button
                        className={"w-36"}
                        variant={mode === "sell" ? "default" : "outline"}
                        onClick={() => setMode("sell")}
                        disabled={userBalance === 0}
                    >
                        Sell
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(submit)}>
                    <div className={"space-y-2 relative"}>
                        <div className={"space-y-4"}>
                            <div className={"rounded-lg p-2"}
                                 style={{
                                     backgroundColor: "hsl(210, 88%, 15%)"
                                 }}>
                                <p className={"text-xs text-muted-foreground w-full"}>
                                    {mode === "buy" ? "You're buying" : "You're selling"}
                                </p>
                                <div className="flex p-2 items-center gap-2">
                                    <input
                                        className={"w-full h-10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-2xl"}
                                        {...register("amount", {
                                            required: "This field is required",
                                            valueAsNumber: true,
                                            min: {
                                                value: 0,
                                                message: "Amount must be greater than 1"
                                            },
                                            validate: value => {
                                                console.log("value", value)
                                                return !isNaN(value) || "Amount must be a number"
                                            }
                                        })}
                                        type={"number"}
                                        style={{
                                            backgroundColor: "hsl(210, 88%, 15%)",
                                            width: "100%",
                                        }}
                                    />
                                    <div className={"text-2xl text-muted-foreground"}>
                                        {token.symbol}
                                    </div>
                                    <div
                                        className="rounded-full border-2 border-white inline-flex items-center justify-center">
                                        <img
                                            src={token.iconUrl || "./public/garfield.png"}
                                            alt={token.symbol}
                                            width={48}
                                            height={48}
                                            className="rounded-full"
                                        />
                                    </div>
                                </div>


                                {errors.amount && <div className={"text-xs text-red-500"}>{errors.amount.message}</div>}
                                {currentAccount && <div className={"text-xs text-muted-foreground"}>you
                                    have: {truncateDecimals(userBalance, token.decimals)} {token.symbol}</div>}
                            </div>
                        </div>
                        <div className={"flex justify-center"}>
                            <div className={"space-y-2"}>
                                <div className={"text-center"}>
                                    {errorMessage && <div className="text-red-500 text-ms mt-1">{errorMessage}</div>}
                                    {!errorMessage && <div>
                                        <div>You&apos;ll {mode === "buy" ? "pay" : "receive"}</div>
                                        <div className={"flex space-x-2 justify-center"}>
                                            <img src={"..//sui-sea.svg"} alt={"Sui Logo"} width={20} height={20}/>
                                            <div className={"text-xl"}>
                                                {isLoadingCoinPrice ? "Fetching price..." : `${getValueWithDecimals(coinPrice || 0, 9, 4)} SUI`}
                                            </div>
                                        </div>
                                    </div>}
                                </div>
                                <div className={"text-center"}>
                                    {currentAccount?.address
                                        ? (<Button
                                            disabled={token.status !== CoinStatus.OPEN || errorMessage !== null}
                                            //  disabled={token.status !== CoinStatus.OPEN || buttonTradeDisableStatus}
                                            className={"md:w-48 xs:w-24 sm:w-24"}
                                            type={"submit"}>
                                            {mode === "buy" ? "Buy" : "Sell"}

                                        </Button>)
                                        : <ConnectButton connectText={`Connect wallet to buy ${token.symbol}`}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            <div className="mt-4">
                <label htmlFor="shakeBox" className="block text-sm font-medium text-red-700">Shake Box</label>
                <input
                    type="text"
                    id="shakeBox"
                    className="mt-1 block w-full rounded-md border-red-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-red-700"
                    placeholder="Type to shake..."
                    onInput={(e) => {
                        const input = e.target as HTMLInputElement;
                        input.classList.add('animate-shake');
                        setTimeout(() => input.classList.remove('animate-shake'), 500);
                    }}
                />
            </div>
            </CardContent>
        </Card>

    )
}