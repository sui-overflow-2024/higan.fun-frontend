'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, FC, SetStateAction, useContext, useEffect, useState} from "react";
import {cn, getCoinPath, getCoinPathFunc, getRandomNumber} from "@/lib/utils";
import Image from "next/image";
import {TokenFromChain, TokenFromRestAPI} from "@/lib/types";
import {
    ConnectButton,
    useCurrentAccount,
    useCurrentWallet,
    useSignAndExecuteTransactionBlock,
    useSuiClient, useSuiClientQuery
} from "@mysten/dapp-kit";
import {coinRestApi} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
import {TransactionBlock,} from "@mysten/sui.js/transactions";

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
                    onChange={(e) => setAmount(parseInt(e.target.value) * 10 ^ token.decimals)}
                    disabled={variant === "quote"}
                />
                <CoinSelectDropdown token={token} setToken={setToken}/>
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
    });

    const { data: data2 } = useSuiClientQuery('getAllBalances', {
        owner: currentAccount?.address || "",
    });

    console.log("Owned objects", data)
    console.log("Owned objects2", data2)
    const exampleToken = {
        "packageId": "0xee66395b04d74365c0080faf7b6f0ddc4d9c92009bc188b9e134d483853dab81",
        "module": "coin_example",
        "storeId": "0x326f37e7f1ebb2b6f3c19430039041c5acc5a6b860779025a48cfef556938fb2",
        "creator": "somecreator",
        "decimals": 0,
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
    const [baseAmount, setBaseAmount] = useState<number>(getRandomNumber(100, 5000))
    const [baseToken, setBaseToken] = useState<TokenFromRestAPI>(exampleToken)
    const [quoteToken, setQuoteToken] = useState<TokenFromRestAPI>(exampleToken)
    const [quoteAmount, setQuoteAmount] = useState<number>(getRandomNumber(100, 5000))
    const baseTokenControl = <TokenAmountInput variant={"base"} token={baseToken} setToken={setBaseToken}
                                               amount={baseAmount} setAmount={setBaseAmount}/>
    const quoteTokenControl = <TokenAmountInput variant={"quote"} token={quoteToken} setToken={setQuoteToken}
                                                amount={quoteAmount} setAmount={setQuoteAmount}/>
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