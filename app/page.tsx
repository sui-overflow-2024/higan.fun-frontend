'use client'
// Why are we still here?
// import {generateFakeToken} from "@/lib/utils";
import {useContext, useState} from "react";
import {AppConfigContext} from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";
import {generateFakeToken} from "@/lib/utils";
import {TokenCard} from "@/components/TokenCard";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Input} from "@/components/ui/input";

export default function Home() {
    const appConfig = useContext(AppConfigContext)
    const [token, setToken] = useState<TokenFromRestAPI | null>(null)
    // useEffect(() => {
    //     const fetchToken = async () => {
    //         const t = await coinRestApi.getById(appConfig, "0x443b012ada487098577eb07008fb95caa5eb152e8af4bd85c0cef41ac67bb101")
    //         console.log("Fetched token", t)
    //         setToken(t)
    //     }
    //     fetchToken()
    // })

    const tokens: TokenFromRestAPI[] = []

    //generate 30 fake tokens
    for (let i = 0; i < 30; i++) {
        tokens.push(generateFakeToken())
    }

    return (
        <main className="min-h-screen container">
            <div className="flex-col items-center justify-center space-y-8 mt-8">
                <div className={"text-center"}>
                    <Link href={"createCoin"}>
                        <Button
                            className={"p-8 bg-accent text-3xl text-black"}
                            variant={"default"}>
                            LAUNCH YOUR OWN TOKEN
                        </Button>
                    </Link>
                </div>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-between">
                    <div>
                        <p className={"text-white text-2xl text-center"}>Newest</p>
                        <TokenCard token={generateFakeToken()}/>
                    </div>
                    <div>
                        <p className={"text-white text-2xl text-center"}>Hottest</p>
                        <TokenCard token={generateFakeToken()}/>
                    </div>
                    <div>
                        <p className={"text-white text-2xl text-center"}>Imminent</p>
                        <TokenCard token={generateFakeToken()}/>
                    </div>
                </div>
                <div className={"text-center justify-center flex space-x-2"}>
                    <Input
                        placeholder={"Search for a token"}
                        className={"max-w-[450px]"}
                    ></Input>
                    <Button className={"bg-accent text-black"}>Search</Button>
                </div>
                <div className={"flex"}>
                    <div className={"text-white space-x-4"}>
                        <span className="text-2xl font-bold">Sort by:</span>
                        <Button
                            className={"bg-accent text-lg text-black"}
                        >
                            Created at
                        </Button>
                        <Button
                            className={"text-lg"}
                            variant={"outline"}
                        >
                            Market Cap
                        </Button>
                        <Button
                            className={"text-lg"}
                            variant={"outline"}
                        >
                            TVL last 24h
                        </Button>
                        <Button
                            className={"text-lg"}
                            variant={"outline"}
                        > Price
                        </Button>
                    </div>
                    <div className={"space-x-4 text-white ml-auto"}>
                        <span className="text-2xl font-bold">Order:</span>
                        <Button
                            className={"text-lg"}
                            variant={"outline"}
                        >
                            Ascending
                        </Button>
                        <Button className={"bg-accent text-lg text-black"}
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
