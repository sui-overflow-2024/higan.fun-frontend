'use client'
// Why are we still here?
import {BuySellDialog} from "@/components/BuySellDialog";
// import {generateFakeToken} from "@/lib/utils";
import {useContext, useState} from "react";
import {AppConfigContext} from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";

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
            {/*<TokenCard token={generateFakeToken()}/>*/}
            <BuySellDialog/>
        </main>
    );
}
