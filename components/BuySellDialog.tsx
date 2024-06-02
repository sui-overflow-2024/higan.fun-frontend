'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {getCoinTypePath, getManagerFuncPath, getValueWithDecimals, truncateDecimals} from "@/lib/utils";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI, CoinStatus} from "@/lib/types";
import {useCurrentAccount, useSuiClientQuery} from "@mysten/dapp-kit";
import {TransactionBlock,} from "@mysten/sui.js/transactions";
import type {CoinStruct, SuiClient} from '@mysten/sui.js/client';
import {useForm} from "react-hook-form";
import {customSuiHooks} from "@/lib/sui";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";
import {mutate} from "swr";
import {AppConfig} from "@/lib/config";


// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
const getAllUserCoins = async ({
                                   suiClient,
                                   address,
                                   type,
                               }: {
    suiClient: SuiClient;
    type: string;
    address: string;
}): Promise<CoinStruct[]> => {
    let cursor: string | null | undefined = null;

    let coins: CoinStruct[] = [];
    let iter = 0;
    console.log("getAllUserCoins", suiClient, address, type, cursor)
    do {
        try {
            const res = await suiClient.getCoins({
                owner: address,
                coinType: type,
                cursor: cursor,
                limit: 50,
            });
            coins = coins.concat(res.data);
            cursor = res.nextCursor;
            if (!res.hasNextPage || iter === 8) {
                cursor = null;
            }
        } catch (error) {
            console.log(error);
            cursor = null;
        }
        iter++;
    } while (cursor !== null);

    return coins;
};


// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
const getCoinsGreaterThanAmount = (
    amount: bigint,
    coins: CoinStruct[]
): string[] => {

    const coinsWithBalance: string[] = [];

    let collectedAmount = BigInt(0);

    for (const coin of coins) {
        const balance = BigInt(coin.balance);
        if (
            collectedAmount < amount &&
            !coinsWithBalance.includes(coin.coinObjectId)
        ) {
            coinsWithBalance.push(coin.coinObjectId);
            collectedAmount = collectedAmount + balance;
        }
        if (
            balance === BigInt(0) &&
            !coinsWithBalance.includes(coin.coinObjectId)
        )
            coinsWithBalance.push(coin.coinObjectId);
    }

    if (collectedAmount >= amount) {
        return coinsWithBalance;
    } else {
        throw new Error("Insufficient balance");
    }

}


// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
const getExactCoinByAmount = (
    coinType: string,
    coins: CoinStruct[],
    amount: bigint,
    txb: TransactionBlock
) => {
    if (coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI") {
        const [coinA] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
        return coinA;
    } else {
        const coinsX = getCoinsGreaterThanAmount(amount, coins);

        if (coinsX.length > 1) {
            txb.mergeCoins(
                txb.object(coinsX[0]),
                coinsX.slice(1).map((coin) => txb.object(coin))
            );
        }

        const [coinA] = txb.splitCoins(txb.object(coinsX[0]), [
            txb.pure(amount),
        ]);
        return coinA;
    }
};

const generateBuyPtb = (appConfig: AppConfig, coin: CoinFromRestAPI, amountToBuy: number) => {
    console.log("Attempting to buy ", amountToBuy, "of", coin.symbol, "packageId", coin.packageId, "bondingCurveId", coin.bondingCurveId, "module", coin.module, "decimals", coin.decimals)
    if (amountToBuy <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }


    const txb = new TransactionBlock();
    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    console.log("Splitting coins", txb.gas)
    const splitCoin = txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_coin_buy_price"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.pure(amountToBuy),
        ],
        typeArguments: [getCoinTypePath(coin)]
    })
    const [payment] = txb.splitCoins(txb.gas, [txb.object(splitCoin)]);

    // txb.transferObjects([payment], "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501")
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "buy_coins"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.object(payment),
            txb.pure(amountToBuy),
        ],
        typeArguments: [getCoinTypePath(coin)]
    });
    return txb
}

const generateSellPtb = (appConfig: AppConfig, coin: CoinFromRestAPI, userCoins: CoinStruct[], amountToSell: number): TransactionBlock => {
    console.log("Attempting to sell ", amountToSell, "of", coin.symbol, "packageId", coin.packageId, "bondingCurveId", coin.bondingCurveId, "module", coin.module, "decimals", coin.decimals)
    if (amountToSell <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }

    const txb = new TransactionBlock();
    const exactCoinByAmount = getExactCoinByAmount(getCoinTypePath(coin), userCoins, BigInt(amountToSell), txb)

    txb.moveCall({
        target: getManagerFuncPath(appConfig, "sell_coins"),
        arguments: [
            txb.object(coin.bondingCurveId),
            txb.object(exactCoinByAmount),
        ],
        typeArguments: [getCoinTypePath(coin)]
    });
    return txb;
}

export const getBuyCoinPriceTxb = (appConfig: AppConfig, coinType: string, bondingCurveId: string, amount: number): TransactionBlock => {
    console.log("getBuyCoinPriceTxb", appConfig, coinType, bondingCurveId, amount)
    const txb = new TransactionBlock()
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_coin_buy_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(bondingCurveId),
            txb.pure(amount),
        ],
        typeArguments: [coinType]
    })
    return txb
}
export const getSellCoinPriceTxb = (appConfig: AppConfig, coinType: string, bondingCurveId: string, amount: number): TransactionBlock => {
    console.log("getSellCoinPriceTxb", appConfig, coinType, bondingCurveId, amount)
    const txb = new TransactionBlock()
    txb.moveCall({
        target: getManagerFuncPath(appConfig, "get_coin_sell_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(bondingCurveId),
            txb.pure(amount),
        ],
        typeArguments: [coinType]
    })
    return txb
}


const PriceCalculator: React.FC<{
    suiClient: SuiClient,
    sender: string,
    amount: number,
    mode: "buy" | "sell",
    coinType: string,
    bondingCurveId: string,
    userBalance: number
}> = ({
          suiClient,
          sender,
          amount,
          mode,
          coinType,
          bondingCurveId,
          userBalance,
      }) => {

    const [price, setPrice] = useState<number>(0)
    const [priceError, setPriceError] = useState<Error | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const appConfig = useContext(AppConfigContext)
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                if (isNaN(amount)) {
                    console.log("amount is not a number")
                    return
                }
                console.log("fetching price for", suiClient, coinType, bondingCurveId, amount, mode)
                const price = await customSuiHooks.getCurrentCoinPriceInSui({
                    appConfig,
                    suiClient,
                    sender: sender || appConfig.fallbackDevInspectAddress,
                    coinType,
                    bondingCurveId: bondingCurveId,
                    amount,
                    mode
                })
                setPrice(price)
            } catch (e: any) {
                setPriceError(e)
            }
            setIsLoading(false)
        }
        fetchPrice()
    }, [suiClient, sender, coinType, bondingCurveId, amount, mode])

    if (priceError) return (<div>Error fetching price {priceError.message}</div>)

    return (<div>
        <div>You&apos;ll {mode === "buy" ? "pay" : "receive"}</div>
        <div className={"flex space-x-2 justify-center"}>
            <img src={"..//sui-sea.svg"} alt={"Sui Logo"} width={20} height={20}/>
            <div className={"text-xl"}>
                {isLoading ? "Loading..." : `${getValueWithDecimals(price || 0, 9, 4)} SUI`}
            </div>
        </div>
    </div>)
}

export const BuySellDialog: React.FC<{ token: CoinFromRestAPI, suiClient: SuiClient }> = ({token, suiClient}) => {


    const appConfig = useContext(AppConfigContext)
    const currentAccount = useCurrentAccount()
    const executeTranscation = useTransactionExecution()
    const [mode, setMode] = useState<"buy" | "sell">("buy")
    const [userBalance, setUserBalance] = useState(0)
    const [baseTokenCoins, setBaseTokenCoins] = useState<CoinStruct[]>([])
    const {register, handleSubmit, watch, formState: {errors,}, reset} = useForm<{
        amount: number
    }>({
        defaultValues: {
            amount: 0
        }
    });
    const multiplier = (token?.decimals || 0) > 0 ? Math.pow(10, token?.decimals || 0) : 1
    const amount = watch("amount") * multiplier

    const {data: storeRaw, refetch: refetchStore} = useSuiClientQuery("getObject", {
        id: token?.bondingCurveId || "",
        options: {
            showDisplay: true,
            showContent: true,
        }
    })

    useEffect(() => {
        const fetchBalance = async () => {
            if (!token) return
            if (!currentAccount?.address) return
            if (!suiClient) return

            console.log("fetching balance for", currentAccount?.address, "token", getCoinTypePath(token))
            const balance = await suiClient.getBalance({
                owner: currentAccount?.address || "",
                coinType: getCoinTypePath(token),
            })
            console.log("balance", balance)
            setUserBalance(parseInt(balance.totalBalance || "0"))
            console.log("userBalance", userBalance)

            console.log()
            const coins = await getAllUserCoins({
                suiClient: suiClient,
                type: getCoinTypePath(token),
                address: currentAccount?.address || "",
            });
            console.log("coins", coins)
            setBaseTokenCoins(coins)
        }
        fetchBalance()
    }, [token, currentAccount?.address, suiClient, amount, userBalance, currentAccount])

    const submit = async (data: { amount: number }) => {
        console.log(`${mode}ing ${data.amount} of the token now`)
        const txb = mode === "buy"
            ? generateBuyPtb(appConfig, token, amount)
            : generateSellPtb(appConfig, token, baseTokenCoins, amount);

        await executeTranscation(txb)
        // TODO you can refresh trades and your own balance here

        await mutate({
            client: suiClient,
            sender: "0xbd81e46b4f6c750606445c10eccd486340ac168c9b34e4c4ab587fac447529f5",
            coin: token,
            path: "tokenMetrics",
        })
        await mutate({appConfig, packageId: token.packageId, path: "getHolders"})

        reset({amount: 0})
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
                                        {...register("amount")}
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
                                    <PriceCalculator coinType={getCoinTypePath(token)} amount={amount}
                                                     sender={currentAccount?.address || ""} mode={mode}
                                                     bondingCurveId={token.bondingCurveId}
                                                     userBalance={userBalance}
                                                     suiClient={suiClient}/>
                                </div>
                                <Button
                                    disabled={token.status !== CoinStatus.OPEN}
                                    className={"w-56"}
                                    type={"submit"}>
                                    {mode === "buy" ? "Buy" : "Sell"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>

    )
}