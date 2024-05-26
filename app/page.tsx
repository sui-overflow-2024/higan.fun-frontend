'use client'
import {useContext, useEffect, useState} from "react";
import {AppConfigContext} from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";
import {getMarketCap} from "@/lib/utils";
import {TokenCard} from "@/components/TokenCard";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {coinRestApi} from "@/lib/rest";

export default function Home() {
    const appConfig = useContext(AppConfigContext)
    const [term, setTerm] = useState("");
    const [sort, setSort] = useState<"created" | "marketCap" | "tvl" | "price">("created")
    const [order, setOrder] = useState<"asc" | "desc">("asc")
    const [currentSuiPrice, setSuiPrice] = useState<number>(0);

    const [newestToken, setNewestToken] = useState<TokenFromRestAPI>();
    const [hottestToken, setHottestToken] = useState<TokenFromRestAPI>();
    const [imminentToken, setImminentToken] = useState<TokenFromRestAPI>();
    const [tokens, setTokens] = useState<TokenFromRestAPI[]>([]);

    useEffect(() => {
        const fetchTokens = async () => {
            const t = await coinRestApi.search({appConfig, term, sort, order})
            console.log("Fetched tokens", t)
            setTokens(t);
        }

        fetchTokens()
    }, [term, sort, order])

    useEffect(() => {
        const fetchTopTokens = async () => {
            const result = await coinRestApi.getTop({appConfig})

            setNewestToken(result.newest);
            setHottestToken(result.hottest);
            setImminentToken(result.imminent);
        }
        const fetchSuiPrice = async () => {
            const suiPrice = await coinRestApi.getSuiPrice({appConfig})

            setSuiPrice(suiPrice);
        };

        fetchTopTokens();
        fetchSuiPrice();
    }, [])

    //generate 30 fake tokens
    // for (let i = 0; i < 30; i++) {
    //     tokens.push(generateFakeToken())
    // }
    return (
        <main className="min-h-screen container">
            <div className="flex-col items-center justify-center space-y-8 mt-8">
                <div className={"text-center"}>
                    <Link href={"create"}>
                        <Button
                            className={"p-8 text-3xl hover:underline"}
                            variant={"default"}>
                            CLICK HERE TO LAUNCH YOUR OWN TOKEN
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between">
                    {newestToken && <div>
                        <p className={"text-2xl text-center"}>Newest</p>
                        <TokenCard token={newestToken}
                                   marketCap={getMarketCap(newestToken.suiReserve, currentSuiPrice)}/>
                    </div>}
                    {hottestToken && <div>
                        <p className={"text-2xl text-center"}>Hottest</p>
                        <TokenCard token={hottestToken}
                                   marketCap={getMarketCap(hottestToken.suiReserve, currentSuiPrice)}/>
                    </div>}
                    {imminentToken && <div>
                        <p className={"text-2xl text-center"}>Imminent</p>
                        <TokenCard token={imminentToken}
                                   marketCap={getMarketCap(imminentToken.suiReserve, currentSuiPrice)}/>
                    </div>}
                </div>
                <div className={"text-center justify-center flex space-x-2"}>
                    <Input
                        placeholder={"Search for a token"}
                        className={"max-w-[450px]"}
                        onChange={(e) => setTerm(e.target.value)}
                    ></Input>
                    <Button>Search</Button>
                </div>
                <div className={"flex"}>
                    <div className={"space-x-4"}>
                        <span className="text-2xl font-bold">Sort by:</span>
                        <Button
                            onClick={() => setSort("created")}
                            variant={sort === "created" ? "default" : "outline"}
                        >
                            Created at
                        </Button>
                        <Button
                            onClick={() => setSort("marketCap")}
                            variant={sort === "marketCap" ? "default" : "outline"}
                        >
                            Market Cap
                        </Button>
                        <Button
                            onClick={() => setSort("tvl")}
                            variant={sort === "tvl" ? "default" : "outline"}
                        >
                            TVL last 24h
                        </Button>
                        <Button
                            onClick={() => setSort("price")}
                            variant={sort === "price" ? "default" : "outline"}
                        > Price
                        </Button>
                    </div>
                    <div className={"space-x-4 ml-auto"}>
                        <span className="text-xl font-bold">Order:</span>
                        <Button
                            onClick={() => setOrder("asc")}
                            variant={order === "asc" ? "default" : "outline"}
                        >
                            Ascending
                        </Button>
                        <Button
                            onClick={() => setOrder("desc")}
                            variant={order === "desc" ? "default" : "outline"}
                        >
                            Descending
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between">
                    {tokens.map((token, index) => (
                        <TokenCard key={index} token={token}
                                   marketCap={getMarketCap(token.suiReserve, currentSuiPrice)}/>
                    ))}
                </div>
                {/* <TokenCard token={generateFakeToken()} /> */}
            </div>
        </main>
    );
}
