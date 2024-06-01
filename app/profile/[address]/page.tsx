'use client'
import {Button} from "@/components/ui/button";
import {useCurrentAccount, useSuiClient, useSuiClientContext, useSuiClientQuery} from "@mysten/dapp-kit";
import {FC, useContext, useEffect, useState} from "react";
import type {CoinBalance} from "@mysten/sui.js/client";
import {copyTextToClipboard, extractPriceFromDevInspect, getValueWithDecimals, suiToUsdLocaleString} from "@/lib/utils";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {getSellCoinPriceTxb} from "@/components/BuySellDialog";
import {useParams} from "next/navigation";
import {CoinFromRestAPI} from "@/lib/types";
import {useToast} from "@/components/ui/use-toast";
import {ExternalLink} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {AppConfigContext, CurrentSuiPriceContext} from "@/components/Contexts";
import useSWR from "swr";
import {CoinGetAllKey, coinRestApi} from "@/lib/rest";
import {getTokenMetrics, TokenMetric, TokenMetricKey} from "@/lib/sui";

interface CoinHeldRowProps {
    address: string;
    coinBalance: CoinBalance;
    coinFromRestApi?: CoinFromRestAPI;
}


const CoinsHeldRow: FC<CoinHeldRowProps> = ({address, coinBalance, coinFromRestApi}) => {

    const ctx = useSuiClientContext();
    const suiClient = useSuiClient()
    const appConfig = useContext(AppConfigContext)
    const [sellPrice, setSellPrice] = useState<number>(0)
    const currentSuiPrice = useContext(CurrentSuiPriceContext)
    const {data: metadata, isLoading, isError, error} = useSuiClientQuery('getCoinMetadata', {
        coinType: coinBalance.coinType,
    })


    useEffect(() => {
        const fetchCurrentPrice = async () => {
            if (!coinFromRestApi) return
            const path = coinFromRestApi ? `${coinFromRestApi.packageId}::${coinFromRestApi.storeId}` : coinBalance.coinType.split("::").slice(0, 2).join("::")
            const price = await suiClient.devInspectTransactionBlock({
                transactionBlock: getSellCoinPriceTxb(coinBalance.coinType, coinFromRestApi?.storeId || "", parseInt(coinBalance.totalBalance)),
                sender: address || appConfig.fallbackDevInspectAddress,
            })
            setSellPrice(extractPriceFromDevInspect(price))
        }
        fetchCurrentPrice()
    }, [address, appConfig.fallbackDevInspectAddress, coinBalance.coinType, coinBalance.totalBalance, coinFromRestApi, suiClient])

    // For now just hide missing metadata
    if (!coinFromRestApi || !metadata) return <></>

    return (<div className="grid grid-cols-10 items-center  p-2 bg-gray-800 rounded-sm">
        <div className={"col-span-1"}>
            <img
                src={metadata.iconUrl || "./public/garfield.png"}
                alt={metadata.name}
                width={40}
                height={40}
            />
        </div>
        <div className={"line-clamp-1 col-span-3"}>
            <a href={`/coin/${coinFromRestApi.packageId}`} className={"hover:underline"}>
                {coinFromRestApi.name}
            </a>
        </div>
        <div className={"col-span-3 flex gap-1 items-center"}>
            <div>{getValueWithDecimals(parseInt(coinBalance.totalBalance), metadata.decimals, 2)}</div>
            <div>{coinFromRestApi.symbol}</div>
            <div className={"text-sm text-muted-foreground"}>(~{suiToUsdLocaleString(sellPrice, currentSuiPrice)})</div>
        </div>
        <div className="col-span-3 flex-col">
            <Link href={`/coin/${coinBalance.coinType.split('::')[0]}`}>
                <Button size="sm" variant="link">View Coin</Button>
            </Link>
            <Link href={`https://suiscan.xyz/${ctx.network || "mainnet"}/account/${address}`} target="_blank"
                  rel="noopener noreferrer">
                <Button size="sm" variant="link">
                    <ExternalLink className="h-3 w-3 mr-1"/>View on SuiScan
                </Button>
            </Link>
        </div>
    </div>);
}

const CoinsHeld: FC<{ profileAddress: string }> = ({profileAddress}) => {
    const {data: coins, isLoading, isError, error} = useSuiClientQuery('getAllBalances', {
        owner: profileAddress,
    })
    const appConfig = useContext(AppConfigContext)

    const {data: coinsFromRestApi, error: errorFromRestApi} = useSWR<CoinFromRestAPI[], any, CoinGetAllKey>({
        appConfig,
        packageIds: coins?.map(coin => coin.coinType.split("::")[0]) || [],
        path: "getAll",
    }, coinRestApi.getAll)

    console.log("Coins from REST API", coinsFromRestApi)
    console.log("Coins from Sui", coins)
    if (!coins || !coinsFromRestApi) return <>Loading coins</>
    if (isError) {
        return <div>Error: {((error || errorFromRestApi) as Error).message}</div>
    }

    return (<div className="space-y-2 gap-2">
        {coins?.map((coin, index) => {
            const packageIdFromCoinType = coin.coinType.split("::")[0]
            const coinFronRestApi = coinsFromRestApi.find((c) => {
                return c.packageId === packageIdFromCoinType
            })
            return (<CoinsHeldRow key={index} address={profileAddress} coinBalance={coin}
                                  coinFromRestApi={coinFronRestApi}/>)
        })}
    </div>);
}

const CoinsCreatedRow: FC<{ token: CoinFromRestAPI }> = ({token}) => {
    const client = useSuiClient()
    const {
        data: tokenMetrics,
        error: fetchTokenMetricsError,
        isLoading: isLoadingTokenPrice
    } = useSWR<TokenMetric, any, TokenMetricKey>(
        {
            client,
            sender: "0xbd81e46b4f6c750606445c10eccd486340ac168c9b34e4c4ab587fac447529f5",
            coin: token,
            path: "tokenMetrics",
        }, getTokenMetrics, {refreshInterval: 5000});
    const currentSuiPrice = useContext(CurrentSuiPriceContext)
    console.log("console metrics", tokenMetrics);

    return <div className="grid grid-cols-12 items-center  p-2 bg-gray-800 rounded-sm">
        <div className={"col-span-1"}>
            <img
                src={token.iconUrl || "./public/garfield.png"}
                alt={token.name}
                width={40}
                height={40}
            />
        </div>
        {/*<div className={"col-span-4"}>{token.name} ({token.symbol})</div>*/}
        <div className={"col-span-1"}>{token.symbol}</div>

        <div className={"col-span-3 flex-col text-center"}>
            <div className={"text-xs text-muted-foreground"}>Cur. Supply</div>
            <div>~{getValueWithDecimals(tokenMetrics?.totalSupply || 0, token.decimals, 0)} {token.symbol}</div>
        </div>
        <div className={"col-span-3 flex-col text-center"}>
            <div className={"text-xs text-muted-foreground"}>Cur. Price</div>
            <div>~{getValueWithDecimals(tokenMetrics?.tokenPrice || 0, token.decimals, 2)} SUI</div>
            <div
                className={"text-xs text-muted-foreground"}>{suiToUsdLocaleString(tokenMetrics?.tokenPrice || 0, currentSuiPrice)}</div>
        </div>
        <div className={"col-span-3 flex-col text-center"}>
            <div className={"text-xs text-muted-foreground"}>Sui Rsrv.</div>
            <div>~{getValueWithDecimals(tokenMetrics?.suiBalance || 0, 9, 0)} SUI</div>
            <div
                className={"text-xs text-muted-foreground"}>{suiToUsdLocaleString(tokenMetrics?.suiBalance || 0, currentSuiPrice)}</div>
        </div>
        <div className={"col-span-1"}>TODO BCP
            {/*Bonding curve progress*/}
        </div>
    </div>
}
const CoinsCreated: FC<{ profileAddress: string }> = ({profileAddress}) => {

    const appConfig = useContext(AppConfigContext)
    const account = useCurrentAccount()
    const {data: coinsFromRestApi, error: errorFromRestApi} = useSWR<CoinFromRestAPI[], any, CoinGetAllKey>({
        appConfig,
        creator: profileAddress,
        path: "getAll",
    }, coinRestApi.getAll)

    if (!coinsFromRestApi) return <>Loading coins</>
    if (errorFromRestApi) {
        return <div>Error fetching coins from REST API: {((errorFromRestApi) as Error).message}</div>
    }


    return (<div className="space-y-2 gap-2 text-center">
        <Link href={"/createCoin"}><Button variant={"outline"}>+ Create a new coin now</Button></Link>
        {coinsFromRestApi?.map((coin, index) => {
            return (<CoinsCreatedRow key={index} token={coin}/>)
        })}
    </div>);
}

const ProfilePage = () => {
    const ctx = useSuiClientContext();
    let {address} = useParams()
    address = address as string
    const {toast} = useToast()
    const [view, setView] = useState<'coins_held' | 'coins_created'>('coins_held')
    console.log("Loading profile for address", address)
    return (<div className={"flex justify-center mt-16"}>
            <div className="max-w-xl">
                <div className="flex items-center gap-2">
                    <div>
                        <Jazzicon diameter={40} seed={jsNumberForAddress(address || "")}/>
                    </div>
                    <div className={"flex-col overflow-x-auto"}>
                        <div className="cursor-pointer hover:underline"
                             onClick={() => {
                                 copyTextToClipboard(address)
                                 toast({
                                     title: "Copied address to clipboard",
                                     duration: 2000,
                                 })
                             }
                             }>{address} </div>
                        <a className={"cursor-pointer hover:underline text-muted-foreground text-xs flex"}
                           href={`https://suiscan.xyz/${ctx.network}/account/${address}`}>
                            <ExternalLink className={"h-4 w-4 ml-auto"}/> View on SuiScan</a>
                    </div>
                </div>
                <div className="mt-6 max-w-xl space-y-4">
                    <div className={"text-center"}>
                        <Button variant={view === 'coins_held' ? 'default' : 'link'}
                                onClick={() => setView('coins_held')}>Coins
                            Held</Button>
                        <Button variant={view === 'coins_created' ? 'default' : 'link'}
                                onClick={() => setView('coins_created')}>Coins Created</Button>
                    </div>
                    {view === 'coins_held' && <CoinsHeld profileAddress={address}/>}
                    {view === 'coins_created' && <CoinsCreated profileAddress={address}/>}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;