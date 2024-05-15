'use client'
// Why are we still here?
import {TokenCard} from "@/components/TokenCard";
import {BuySellDialog} from "@/components/BuySellDialog";
import {TokenFromRestAPI} from "@/lib/types";
import {useContext, useEffect, useState} from "react";
import {coinRestApi} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
// import {generateFakeToken} from "@/lib/utils";


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
    return (
        <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
            {/*<TokenCard token={token}/>*/}
            <BuySellDialog/>
        </main>
    );
}
