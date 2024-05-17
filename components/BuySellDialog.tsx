'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from "react";
import {cn, getCoinPath, getCoinPathFunc, getRandomNumber, getValueWithDecimals} from "@/lib/utils";
import Image from "next/image";
import {TokenFromChain, TokenFromRestAPI} from "@/lib/types";
import {
    ConnectButton,
    useCurrentAccount,
    useCurrentWallet,
    useSignAndExecuteTransactionBlock,
    useSuiClient, useSuiClientMutation, useSuiClientQuery
} from "@mysten/dapp-kit";
import {coinRestApi} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
import {TransactionBlock,} from "@mysten/sui.js/transactions";
import {bcs} from "@mysten/sui.js/bcs";

const CoinSelectDropdown: React.FC<{
    token: TokenFromRestAPI,
    setToken: Dispatch<SetStateAction<TokenFromRestAPI>>
}> = ({token}) => {
    /*TODO below should open coin selection dialog on click*/
    return (<div
        className="rounded-xl min-w-28 dropdown-button bg-gray-800 text-white
                    flex items-center justify-between px-2 py-2
                    cursor-pointer transition duration-150 ease-in-out hover:bg-gray-700">
        <div
            className="max-w-6 max-h-5 flex space-x-0.5 text-md"
        >

            <img
                src={token.iconUrl || "../../public/sui-sea.svg"} //TODO dynamic image from on-chain config
                width={100}
                height={100}
            />
            <span>{token.symbol}</span>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
    </div>)
}

const TokenAmountInput: FC<{
    variant: "base" | "quote"
    token: TokenFromChain
    setToken: Dispatch<SetStateAction<TokenFromRestAPI>>,
    amount: number
    setAmount: Dispatch<SetStateAction<number>>
}> = ({variant, token, setToken, amount, setAmount}) => {

    const balance = useSuiClientQuery("getBalance", {
        owner: useCurrentAccount()?.address || "",
        coinType: getCoinPath(token),
    })
    const multiplier = token.decimals > 0 ? Math.pow(10, token.decimals) : 1
    console.log("multiplier", multiplier)
    console.log("amount", amount)
    const realAmount = amount * multiplier
    console.log("realAmount", realAmount)

    return (<div className={"space-y-4"}>
        <div className={"rounded-lg p-2"}
             style={{
                 backgroundColor: "hsl(210, 88%, 15%)"
             }}>
            <p className={"text-xs text-muted-foreground w-full"}>
                {variant === "base" ? "You pay" : "You receive"}
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
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    disabled={variant === "quote"}
                />
                <CoinSelectDropdown token={token} setToken={setToken}/>
            </div>
            <div className={"text-xs text-muted-foreground"}>
                Max: {balance.data?.totalBalance || 0}
                {
                    process.env.NODE_ENV === "development" && <>
                        {/*<div className={"overflow-ellipsis"}>*/}
                        {/*    coinPath: {`${getCoinPath(token)}`}*/}
                        {/*</div>*/}
                        <div>
                            actualAmount: {realAmount}
                        </div>
                        <div>
                            coinObjectCount: {`${balance.data?.coinObjectCount}`}
                        </div>
                        <div>
                            lockedBalance: {`${JSON.stringify(balance.data?.lockedBalance)}`}
                        </div>
                      <div>
                            totalBalance: {`${balance.data?.totalBalance}`}
                      </div>
                    </>
                }
            </div>
        </div>
    </div>)
}


const generateBuyPtb = (coin: TokenFromRestAPI, amount: number): TransactionBlock => {
    console.log("Attempting to buy ", amount, "of", coin.symbol, "packageId", coin.packageId, "storeId", coin.storeId, "module", coin.module)
    if (amount <= 0) {
        throw new Error("Attempt to buy 0 or less tokens")
    }
    const txb = new TransactionBlock();
    const target = getCoinPathFunc(coin, "buy_coins")
    console.log("Target is", target)
    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    console.log("Splitting coins", txb.gas)
    const [payment] = txb.splitCoins(txb.gas, [amount]);
    // txb.transferObjects([payment], "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501")
    txb.moveCall({
        target,
        arguments: [
            txb.object(coin.storeId),
            txb.object(payment),
        ],
    });
    return txb
}

const generateSellPtb = (coin: TokenFromRestAPI, amount: number): TransactionBlock => {
    console.log("Attempting to sell ", amount, " of ", coin.symbol)
    if (amount <= 0) {
        throw new Error("Attempt to sell 0 or less tokens")
    }
    const txb = new TransactionBlock();

    //Amount here already has multiplication for decimals applied (see TokenAmountInput)
    //txb.gas() for the coin because you purchase the custom coin w/ Sui
    const coinPath = getCoinPath(coin)
    console.log("Coin path is", coinPath)
    const [coinToSendToMint] = txb.splitCoins(getCoinPath(coin), [amount]);
    txb.moveCall({
        target: getCoinPathFunc(coin, "sell_coins"),
        arguments: [
            txb.object(coin.storeId),
            txb.object(coinToSendToMint),
        ],
    });
    return txb;
}

export const getBuyCoinPriceTxb = (coin: TokenFromRestAPI, amount: number): TransactionBlock => {
    const txb = new TransactionBlock()
    const multiplier = coin.decimals > 0 ? Math.pow(10, coin.decimals) : 1
    txb.moveCall({
        target: getCoinPathFunc(coin, "get_coin_buy_price"),
        arguments: [
            txb.object(coin.storeId),
            txb.pure(amount * multiplier),
        ],
    })
    return txb
}


export const BuySellDialog: React.FC<{}> = () => {
    const suiClient = useSuiClient()
    const currentAccount = useCurrentAccount()
    const currentWallet = useCurrentWallet()
    const appConfig = useContext(AppConfigContext)
    const [token, setToken] = useState<TokenFromRestAPI>()
    useEffect(() => {
        const fetchToken = async () => {
            const t = await coinRestApi.getById(appConfig, "0x443b012ada487098577eb07008fb95caa5eb152e8af4bd85c0cef41ac67bb101")
            console.log("Fetched token", t)
            setToken(t)
        }
        fetchToken()
    }, [])
    // console.log("Current account is", currentAccount)
    // https://docs.sui.io/sui-api-ref#suix_getcoins
    console.log("Current wallet is", currentWallet)
    const { data } = useSuiClientQuery('getCoins', {
        owner: currentAccount?.address || "",
        coinType: "0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8::coin_example::COIN_EXAMPLE"
    });

    const { data: data2 } = useSuiClientQuery('getAllBalances', {
        owner: currentAccount?.address || "",
    });

    const { data: data5 } = useSuiClientQuery('getCoinMetadata', {
        coinType: "0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8::coin_example::COIN_EXAMPLE"
    });

    console.log("getCoins", data)
    console.log("getAllBalances", data2)
    console.log("CoinMetadata", data5)
    const exampleToken = {
        "packageId": "0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8",
        "module": "coin_example",
        "storeId": "0x4b2a03005315e882bd052fec6d4251d889dd972b802cd344b22d300d2b8bab50",
        "creator": "somecreator",
        "decimals": 3,
        "name": "Test Coin",
        "symbol": "TST",
        "description": "This is a test coin",
        "iconUrl": "https://example.com/icon.png",
        "website": "http://example.com",
        "twitterUrl": "",
        "discordUrl": "",
        "telegramUrl": "",
        "whitepaperUrl": "",
        "createdAt": new Date(),
        "updatedAt": new Date(),
    }

    const {mutate: signAndExecuteTransactionBlock} = useSignAndExecuteTransactionBlock();
    const [mode, setMode] = useState<"buy" | "sell">("buy")
    const [controlOrder, setControlOrder] = useState<"base-quote" | "quote-base">("base-quote")
    const [baseAmount, setBaseAmount] = useState<number>(0)
    const [quoteAmount, setQuoteAmount] = useState<number>(0)
    const [baseToken, setBaseToken] = useState<TokenFromRestAPI>(exampleToken)
    const [quoteToken, setQuoteToken] = useState<TokenFromRestAPI>(exampleToken)
    const [targetAmount, setTargetAmount] = useState(0)
    const [targetAmountDisplay, setTargetAmountDisplay] = useState("")
    const baseTokenControl = <TokenAmountInput variant={"base"} token={baseToken} setToken={setBaseToken}
                                               amount={baseAmount} setAmount={setBaseAmount}/>
    const quoteTokenControl = <TokenAmountInput variant={"quote"} token={quoteToken} setToken={setQuoteToken}
                                                amount={quoteAmount} setAmount={setQuoteAmount}/>
    // const {data: data3, isPending, error, refetch} = useSuiClientQuery('getDynamicFieldObject', {
    //     parentId: baseToken.packageId,
    // })

    const {data: data4, isPending: isPending2, error: error2, refetch: refetch2} = useSuiClientQuery('getDynamicFields', {
        parentId: baseToken.packageId,
    })

    // const {data: data4, isPending: isPending2, error: error2, refetch: refetch2} = useSuiClientQuery('getDynamicFields', {
    //     parentId: baseToken.packageId,
    // })

    const { mutate } = useSuiClientMutation('dryRunTransactionBlock');

    // console.log("Data3 is", data3)
    console.log("Data4 is", data4)
    const {data: supply, error} = useSuiClientQuery("getTotalSupply", {
        coinType: `0x2::coin::TreasuryCap<0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8::coin_example::COIN_EXAMPLE>`,
        // coinType: getCoinPath(baseToken),
    })
    const {data: storeRaw} = useSuiClientQuery("getObject", {
        id: baseToken.storeId,
        options:{
            showDisplay: true,
            showContent: true,
        }
    })
    const {data: capRaw} = useSuiClientQuery("getObject", {
        id:  `0x2::coin::TreasuryCap<${getCoinPath(baseToken)}>`,
        options:{
            showDisplay: true,
            showContent: true,
        }
    })



    console.log("Get raw store", storeRaw)
    console.log("Get raw cap", capRaw)
    console.log("Error is", error)
    console.log("Supply is", supply)
    useEffect(() => {
        if(!baseAmount) return
        if(mode === "buy") {
            const fetchPrice = async () => {
                const price = await refetch2()
                console.log("decimals", baseToken.decimals)
                console.log("amount2", 10**baseToken.decimals)
                const multiplier = 10**baseToken.decimals
                console.log("multiplier", multiplier)
                const txb = getBuyCoinPriceTxb(exampleToken, baseAmount)
                txb.setSenderIfNotSet(currentAccount?.address || "")
                const dryRunRes = await suiClient.dryRunTransactionBlock({
                    transactionBlock: await txb.build({
                        client: suiClient,
                    }),
                })
                console.log("dryRunRes", dryRunRes)
                const b = mutate({
                    transactionBlock: await txb.build(),
                })
                console.log("Mutate result", b)
                const res = await suiClient.devInspectTransactionBlock({
                    transactionBlock: txb,
                    sender: currentAccount?.address || "",
                });

                const data = res.results?.[0]?.returnValues?.[0][0]
                const type = res.results?.[0]?.returnValues?.[0][1]
                const decoded = bcs.de("u64", new Uint8Array(data || []))
                console.log("Decoded", decoded)
                console.log("Decoded", decoded as number)
                console.log("Decoded", decoded.toString())
                console.log("Inspect result", res)
                setTargetAmount(decoded)
                console.log(getValueWithDecimals(decoded as number, 9, 4))
                setTargetAmountDisplay(getValueWithDecimals(decoded as number, 9, 4))
            }
            fetchPrice()
        }
    }, [baseAmount])
    const controls = controlOrder === "base-quote" ? [baseTokenControl, quoteTokenControl] : [quoteTokenControl, baseTokenControl]
    return (<Card>
            <CardHeader>
                <div className={"flex justify-between min-w-[400px]"}>
                    <Button
                        className={"min-w-36 bg-accent"}
                        variant={mode !== "buy" ? "default" : "secondary"}
                        onClick={() => setMode("buy")}>
                        Buy
                    </Button>
                    <Button
                        className={"min-w-36"}
                        variant={mode === "sell" ? "default" : "outline"}
                        onClick={() => setMode("sell")}>
                        Sell
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className={"space-y-2 relative"}>
                    {controls[0]}
                    {/*Button below is the swap button, TODO using the wrong colors*/}
                    <button
                        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white"
                        style={{marginTop: '-0.5rem'}}  // Adjust this value to position the button correctly
                        onClick={() => setControlOrder(controlOrder === "base-quote" ? "quote-base" : "base-quote")}
                    >
                        <div>
                            <Image
                                src={"./material-swap.svg"}
                                alt={"swap"}
                                width={20}
                                height={20}
                            />
                        </div>
                    </button>
                    {targetAmount > 0 && <div>
                        You pay {targetAmountDisplay} SUI
                    </div>}
                    <div>
                        Current supply: {storeRaw?.data?.content?.fields.treasury.fields.total_supply.fields.value}
                    </div>
                    {controls[1]}
                    { currentAccount ?
                    <Button className={"min-w-72"} onClick={() => signAndExecuteTransactionBlock({
                        transactionBlock: mode === "buy"
                            ? generateBuyPtb(exampleToken, baseAmount)
                            : generateSellPtb(exampleToken, baseAmount),
                        chain: 'sui:devnet',
                    })}>
                        {mode === "buy" ? "Buy" : "Sell"}
                    </Button>  : <ConnectButton/>
                    }
                </div>
            </CardContent>
        </Card>

    )
}