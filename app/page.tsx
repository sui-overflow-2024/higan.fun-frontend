'use client'
import {FC, useEffect, useState} from "react";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI} from "@/lib/types";
import {TokenCard} from "@/components/TokenCard";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {coinRestApi} from "@/lib/rest";
import useSWR from "swr";
import {useContextSelector} from "use-context-selector";


const TopTokens: FC = () => {
    const {axios, shortInterval} = useContextSelector(AppConfigContext, (v) => ({
        axios: v.axios,
        shortInterval: v.shortInterval
    }));
    const {data: topTokens, error: fetchTopTokensError} = useSWR({
        axios,
        path: "getTop"
    }, coinRestApi.getTop, {refreshInterval: shortInterval});

    if (fetchTopTokensError) {
        return <div>Error loading top tokens {fetchTopTokensError}</div>
    }

    if (!topTokens || !topTokens.newest || !topTokens.hottest || !topTokens.imminent) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between">
            <div>
                <p className={"text-2xl text-center"}>Newest</p>
                <TokenCard token={topTokens.newest}/>
            </div>
            <div>
                <p className={"text-2xl text-center"}>Hottest</p>
                <TokenCard token={topTokens.hottest}/>
            </div>
            <div>
                <p className={"text-2xl text-center"}>Imminent</p>
                <TokenCard token={topTokens.imminent}/>
            </div>
        </div>
    );
};
export default function Home() {
    const [term, setTerm] = useState("");
    const [sort, setSort] = useState<"created" | "marketCap" | "tvl" | "price">("created")
    const [order, setOrder] = useState<"asc" | "desc">("desc")
    const [tokens, setTokens] = useState<CoinFromRestAPI[]>([]);
    const axios = useContextSelector(AppConfigContext, (v) => v.axios);

    useEffect(() => {
        const fetchTokens = async () => {
            const t = await coinRestApi.search({axios, term, sort, order})
            console.log("Fetched tokens", t)
            setTokens(t);
        }

        fetchTokens()
    }, [term, sort, order, axios])


    return (
        <main className="min-h-screen container">
            <div className="flex-col items-center justify-center space-y-8 mt-8">
                <div className={"text-center"}>
                    <Link href={"create"}>
                        <Button
                            className={"p-8 text-3xl"}
                            variant={"default"}>
                            CLICK HERE TO LAUNCH YOUR OWN TOKEN
                        </Button>
                    </Link>
                </div>
                <div>
                    <TopTokens/>
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
                        <TokenCard key={index} token={token}/>
                    ))}
                </div>
                {/* <TokenCard token={generateFakeToken()} /> */}
            </div>
        </main>
    );
}
