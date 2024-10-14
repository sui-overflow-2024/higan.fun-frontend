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
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

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
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:    grid-cols-3 items-center justify-between">
            <div>
                <p className={"text-2xl text-center"}>Newest</p>
                <TokenCard token={topTokens.newest}/>
            </div>
            <div>
                <p className={"text-2xl text-center"}>Hottest</p>
                <TokenCard token={topTokens.hottest}/>
            </div>
            <div>
                <p className={"text-2xl text-center"}>Coming Soon</p>
                <TokenCard token={topTokens.imminent}/>
            </div>
        </div>
    );
};
export default function Home() {
    const [term, setTerm] = useState("");
    const [sort, setSort] = useState<"created" | "marketCap" | "tvl" | "price">("created")
    const [sortDisplay, setSortDisplay] = useState<"Created" | "Market Cap" | "TVL 24h" | "price">("Created")
    const [order, setOrder] = useState<"asc" | "desc">("desc")
    const [tokens, setTokens] = useState<CoinFromRestAPI[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [isNextPage, setHasNextPage] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);

    const axios = useContextSelector(AppConfigContext, (v) => v.axios);


    useEffect(() => {
        const fetchTokens = async () => {
            let t = await coinRestApi.search({axios, term, sort, order, offset: offset, pageSize: pageSize + 1})

            setHasNextPage(t.length > pageSize);
            t = t.slice(0, pageSize);

            setTokens(t);
        }
        fetchTokens()
    }, [term, sort, order, axios, offset])

    const handlePagePreviousClick = (e: any) => {
        e.preventDefault();

        setOffset(Math.max(0, offset - pageSize));
    }

    const handlePageNextClick = (e: any) => {
        e.preventDefault();
        if (!isNextPage) return;

        setOffset(offset + pageSize);
    }

    let currentPage = offset / pageSize + 1;

    return (
        <main className="min-h-screen container">
            <div className="flex-col items-center justify-center space-y-8 mt-8">
                <div className={"text-center"}>
                    <Link href={"create"}>
                        <Button
                            className={"p-8 text-lg md:text-3xl"}
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
                <div className={"flex gap-8"}>
                    <div className={"space-x-4 flex items-center sm:text-center"}>
                        <p className="text-xl font-bold">Sort by:</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={"min-w-24"}>{sortDisplay}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onSelect={() => {
                                    setSort("created")
                                    setSortDisplay("Created")
                                }}>
                                    <span>Created</span>
                                    {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                    setSort("marketCap")
                                    setSortDisplay("Market Cap")
                                }}>
                                    <span>Market Cap</span>
                                    {/*<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => {
                                    setSort("tvl")
                                    setSortDisplay("TVL 24h")
                                }}>
                                    <span>TVL 24h</span>
                                    {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className={"space-x-4 flex items-center"}>
                        <p className="text-xl font-bold">Order:</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={"capitalize min-w-24"}>{order}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuItem onSelect={() => setOrder("asc")}>
                                    <span>asc</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setOrder("desc")}>
                                    <span>desc</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between">
                    {tokens.map((token, index) => (
                        <TokenCard key={index} token={token}/>
                    ))}
                </div>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={handlePagePreviousClick}/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">{currentPage}</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" onClick={handlePageNextClick}/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </main>
    );
}
