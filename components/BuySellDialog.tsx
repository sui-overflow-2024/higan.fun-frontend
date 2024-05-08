'use client'
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, FC, SetStateAction, useState} from "react";
import {cn, generateFakeToken, getRandomNumber} from "@/lib/utils";
import Image from "next/image";
import {Token} from "@/lib/types";



interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
}


const CoinSelectDropdown: React.FC<{token: Token, setToken: Dispatch<SetStateAction<Token>>}> = ({token}) => {
    /*TODO below should open coin selection dialog on click*/
    return (<div
        className="rounded-xl min-w-28 dropdown-button bg-gray-800 text-white
                    flex items-center justify-between px-2 py-2
                    cursor-pointer transition duration-150 ease-in-out hover:bg-gray-700">
        <div
            className="max-w-6 max-h-5 flex space-x-0.5 text-md"
        >
            <Image
                src={token.iconUrl} //TODO dynamic image from on-chain config
                alt="coin logo" //TODO dynamic alt text
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
    token: Token
    setToken: Dispatch<SetStateAction<Token>>,
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
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    disabled={variant === "quote"}
                />
                <CoinSelectDropdown token={token} setToken={setToken}/>
            </div>
        </div>
    </div>)
}

export const BuySellDialog: React.FC<{}> = () => {
    const [mode, setMode] = useState<"buy" | "sell">("buy")
    const [controlOrder, setControlOrder] = useState<"base-quote" | "quote-base">("base-quote")
    const [baseAmount, setBaseAmount] = useState<number>(getRandomNumber(100,5000))
    const [baseToken, setBaseToken] = useState<Token>(generateFakeToken())
    const [quoteToken, setQuoteToken] = useState<Token>(generateFakeToken())
    const [quoteAmount, setQuoteAmount] = useState<number>(getRandomNumber(100,5000))
    const baseTokenControl = <TokenAmountInput variant={"base"} token={baseToken} setToken={setBaseToken} amount={baseAmount} setAmount={setBaseAmount}/>
    const quoteTokenControl = <TokenAmountInput variant={"quote"} token={quoteToken} setToken={setQuoteToken} amount={quoteAmount} setAmount={setQuoteAmount}/>
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
                </div>
            </CardContent>
        </Card>

    )
}