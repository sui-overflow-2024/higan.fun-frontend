'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {cn, getCoinPath, getCoinPathFunc, getFunctionPathFromCoinType, getValueWithDecimals} from "@/lib/utils";
import Image from "next/image";
import {TokenFromRestAPI} from "@/lib/types";
import {
    ConnectButton,
    useCurrentAccount,
    useSignAndExecuteTransactionBlock,
    useSuiClient,
    useSuiClientQuery
} from "@mysten/dapp-kit";
import {AppConfigContext} from "@/components/Contexts";
import {TransactionBlock,} from "@mysten/sui.js/transactions";
import {bcs} from "@mysten/sui.js/bcs";
import type {CoinStruct, SuiClient} from '@mysten/sui.js/client';
import {useForm} from "react-hook-form";
import useSWR, {Fetcher} from "swr";


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
    let cursor: string | null | undefined = "";

    let coins: CoinStruct[] = [];
    let iter = 0;

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

const generateBuyPtb = (coin: TokenFromRestAPI, userCoins: CoinStruct[], amountToBuy: number): TransactionBlock => {
    console.log("Attempting to buy ", amountToBuy, "of", coin.symbol, "packageId", coin.packageId, "storeId", coin.storeId, "module", coin.module, "decimals", coin.decimals)
    if (amountToBuy <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }


    const txb = new TransactionBlock();
    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    console.log("Splitting coins", txb.gas)
    const splitCoin = txb.moveCall({
        target: getCoinPathFunc(coin, "get_coin_buy_price"),
        arguments: [
            txb.object(coin.storeId),
            txb.pure(amountToBuy),
        ],
    })
    const [payment] = txb.splitCoins(txb.gas, [txb.object(splitCoin)]);

    // txb.transferObjects([payment], "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501")
    txb.moveCall({
        target: getCoinPathFunc(coin, "buy_coins"),
        arguments: [
            txb.object(coin.storeId),
            txb.object(payment),
            txb.pure(amountToBuy),
        ],
    });
    return txb
}

const generateSellPtb = (coin: TokenFromRestAPI, userCoins: CoinStruct[], amountToSell: number): TransactionBlock => {
    console.log("Attempting to sell ", amountToSell, "of", coin.symbol, "packageId", coin.packageId, "storeId", coin.storeId, "module", coin.module, "decimals", coin.decimals)
    if (amountToSell <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }

    const txb = new TransactionBlock();
    getExactCoinByAmount(getCoinPath(coin), userCoins, BigInt(amountToSell), txb)
    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui

    console.log("Splitting coins", txb.gas)
    const splitCoin = txb.moveCall({
        target: getCoinPathFunc(coin, "get_coin_sell_price"),
        arguments: [
            txb.object(coin.storeId),
            txb.pure(amountToSell),
        ],
    })
    const [coinToSendToSell] = txb.splitCoins(getCoinPath(coin), [txb.object(splitCoin)]);

    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    const coinPath = getCoinPath(coin)
    console.log("Coin path is", coinPath)
    txb.moveCall({
        target: getCoinPathFunc(coin, "sell_coins"),
        arguments: [
            txb.object(coin.storeId),
            txb.object(coinToSendToSell),
            txb.pure(amountToSell),
        ],
    });
    return txb;
}

export const getBuyCoinPriceTxb = (coinType: string, storeId: string, amount: number): TransactionBlock => {
    const txb = new TransactionBlock()
    txb.moveCall({
        target: getFunctionPathFromCoinType(coinType, "get_coin_buy_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(storeId),
            txb.pure(amount),
        ],
    })
    return txb
}
export const getSellCoinPriceTxb = (coinType: string, storeId: string, amount: number): TransactionBlock => {
    console.log("getSellCoinPriceTxb", coinType, storeId, amount)
    const txb = new TransactionBlock()
    txb.moveCall({
        target: getFunctionPathFromCoinType(coinType, "get_coin_sell_price") as `${string}::${string}::${string}`,
        arguments: [
            txb.object(storeId),
            txb.pure(amount),
        ],
    })
    return txb
}

export const getPrice: Fetcher<number, {
    client: SuiClient,
    sender: string,
    coinType: string,
    storeId: string,
    amount: number,
    mode: "buy" | "sell"
}> = async ({client, sender, coinType, storeId, amount, mode}): Promise<number> => {
    console.log(`get coin ${mode} price`, sender)
    const txb = mode === "buy" ? getBuyCoinPriceTxb(coinType, storeId, amount) : getSellCoinPriceTxb(coinType, storeId, amount)
    txb.setSenderIfNotSet(sender)

    const res = await client.devInspectTransactionBlock({
        transactionBlock: txb,
        sender: sender,
    });
    console.log("Inspect result", res)

    const price = res.results?.[0]?.returnValues?.[0][0]
    return bcs.de("u64", new Uint8Array(price || [])) as number
}


const PriceCalculator: React.FC<{
    suiClient: SuiClient,
    sender: string,
    amount: number,
    mode: string,
    coinType: string,
    storeId: string,
    userBalance: number
}> = ({
          suiClient,
          sender,
          amount,
          mode,
          coinType,
          storeId,
    userBalance,
      }) => {
    const {data: price, error: priceError, isLoading} = useSWR({
        client: suiClient,
        sender,
        coinType,
        storeId,
        amount,
        mode
    }, getPrice)

    if (priceError) return (<div>Error fetching price {priceError.message}</div>)
    // if(userBalance === 0 && mode === sell) return (<div>You have nothing to sell</div>)
    // if (!price) return (<div>Loading...</div>)

    return (<div>
        <div>You&apos;ll {mode === "buy" ? "pay" : "receive"}</div>
        <div className={"flex space-x-2 justify-center"}>
            <Image src={"..//sui-sea.svg"} alt={"Sui Logo"} width={20} height={20}/>
            <div className={"text-xl"}>
                {isLoading ? "Loading..." : `${getValueWithDecimals(price, 9, 4)} SUI`}
            </div>
        </div>
    </div>)
}

export const BuySellDialog: React.FC<{ token: TokenFromRestAPI }> = ({token}) => {


    const suiClient = useSuiClient()
    const currentAccount = useCurrentAccount()
    const appConfig = useContext(AppConfigContext)


    const {mutate: signAndExecuteTransactionBlock} = useSignAndExecuteTransactionBlock();
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
        id: token?.storeId || "",
        options: {
            showDisplay: true,
            showContent: true,
        }
    })


    useEffect(() => {
        const fetchBalance = async () => {
            if (!token) return
            console.log("fetching balance for", currentAccount?.address, "token", token.coinType)
            const balance = await suiClient.getBalance({
                owner: currentAccount?.address || "",
                coinType: getCoinPath(token),
            })
            console.log("balance", balance)
            setUserBalance(parseInt(balance.totalBalance || "0"))
            console.log("userBalance", userBalance)

            const coins = await getAllUserCoins({
                suiClient: suiClient,
                type: getCoinPath(token),
                address: currentAccount?.address || "",
            });
            console.log("coins", coins)
            setBaseTokenCoins(coins)
        }
        fetchBalance()
    }, [token, currentAccount?.address, suiClient, amount])

    console.log("baseTokenCoins", baseTokenCoins)
    if (!token) return (<div>Token not found</div>)
    return (<Card>
            <CardHeader>
                <div className={"flex justify-between"}>
                    <Button
                        className={"min-w-36"}
                        variant={mode === "buy" ? "default" : "outline"}
                        onClick={() => setMode("buy")}>
                        Buy
                    </Button>

                    <Button
                        className={"min-w-36"}
                        variant={mode === "sell" ? "default" : "outline"}
                        onClick={() => setMode("sell")}
                        disabled={userBalance === 0}
                    >
                        Sell
                    </Button>
                </div>
            </CardHeader>
            <CardContent>

                <div className={"space-y-2 relative"}>
                    <div className={"space-y-4"}>
                        <div className={"rounded-lg p-2"}
                             style={{
                                 backgroundColor: "hsl(210, 88%, 15%)"
                             }}>
                            <p className={"text-xs text-muted-foreground w-full"}>
                                {mode === "buy" ? "You receive" : "You sell"}
                            </p>
                            <div className={"flex pb-2 "}>
                                <input
                                    className={cn(
                                        "flex h-10" +
                                        " focus:outline-none" +
                                        " disabled:cursor-not-allowed disabled:opacity-50 text-2xl",
                                    )}
                                    style={{
                                        backgroundColor: "hsl(210, 88%, 15%)",
                                    }}
                                    {...register("amount")}
                                />
                                {/*<CoinSelectDropdown token={token} setToken={setToken}/>*/}
                            </div>
                            {errors.amount && <div className={"text-xs text-red-500"}>{errors.amount.message}</div>}
                            <div className={"text-xs text-muted-foreground"}>you have: {userBalance} {token.symbol}</div>
                            {/*<div className={"text-xs text-muted-foreground"}>*/}
                            {/*    {*/}
                            {/*        process.env.NODE_ENV === "development" && <>*/}
                            {/*            actual amount: {amount}*/}
                            {/*        </>*/}
                            {/*    }*/}
                            {/*</div>*/}
                        </div>
                    </div>

                    {/*{controls[1]}*/}
                    <div className={"flex justify-center"}>
                        {currentAccount
                            ? (<div className={"space-y-2"}>
                                <div className={"text-center"}>
                                    <PriceCalculator coinType={token.coinType} amount={amount}
                                                     sender={currentAccount?.address || ""} mode={mode}
                                                     storeId={token.storeId}
                                                     suiClient={suiClient}
                                                     userBalance={userBalance}
                                    />
                                </div>
                                <Button className={"min-w-56"} onClick={() => {
                                    signAndExecuteTransactionBlock({
                                    transactionBlock: mode === "buy"
                                        ? generateBuyPtb(token, [], amount)
                                        : generateSellPtb(token, baseTokenCoins, amount),
                                    chain: 'sui:devnet',
                                })
                                    reset({amount: 0})
                                }}>
                                    {mode === "buy" ? "Buy" : "Sell"}
                                </Button>
                            </div>)
                            : <ConnectButton/>
                        }
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}