'use client'
import {Button} from "@/components/ui/button";
import {useSuiClient, useSuiClientContext, useSuiClientQuery} from "@mysten/dapp-kit";
import {FC, useEffect, useState} from "react";
import type {CoinBalance} from "@mysten/sui.js/client";
import {copyTextToClipboard, extractPriceFromDevInspect, getValueWithDecimals} from "@/lib/utils";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {getSellCoinPriceTxb} from "@/components/BuySellDialog";
import {useFetchManyCoinsFromRest} from "@/hooks/useFetchManyCoinsFromRest";
import {useParams} from "next/navigation";
import {TokenFromRestAPI} from "@/lib/types";
import {useToast} from "@/components/ui/use-toast";
import {ExternalLink} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CoinRowProps {
    address: string;
    coinBalance: CoinBalance;
    coinFromRestApi?: TokenFromRestAPI;
}

const CoinRow: FC<CoinRowProps> = ({address, coinBalance, coinFromRestApi}) => {

    const ctx = useSuiClientContext();
    const suiClient = useSuiClient()

    const [sellPrice, setSellPrice] = useState<number>(0)
    const {data: metadata, isLoading, isError, error} = useSuiClientQuery('getCoinMetadata', {
        coinType: coinBalance.coinType,
    })


    useEffect(() => {
        const fetchCurrentPrice = async () => {
            if(!address) return
            const path = coinFromRestApi ? `${coinFromRestApi.packageId}::${coinFromRestApi.storeId}` : coinBalance.coinType.split("::").slice(0, 2).join("::")
            console.log("path: ", path)
            const price = await suiClient.devInspectTransactionBlock({
                transactionBlock: getSellCoinPriceTxb(coinBalance.coinType, coinFromRestApi?.storeId || "", parseInt(coinBalance.totalBalance)),
                sender: address,
            })
            console.log("price", price)
            console.log("price ext", extractPriceFromDevInspect(price))
            setSellPrice(extractPriceFromDevInspect(price))
        }
        fetchCurrentPrice()
    }, [address, coinBalance.coinType, coinBalance.totalBalance, coinFromRestApi, suiClient])

    // For now just hide missing metadata
    if (!metadata) return <></>
    console.log("metadata", metadata)
    // (<div>Metadata not found</div>)

    return (<div className="flex items-center justify-between p-2 bg-gray-800 rounded-sm">
        <div className="flex items-center space-x-4">
            {metadata.iconUrl ? <Image
                src={metadata.iconUrl} // Replace with actual coin image URL
                alt={metadata.name}
                width={40}
                height={40}
            /> : <Jazzicon diameter={40} seed={jsNumberForAddress(coinBalance.coinType)}/>}
            <div>{metadata.name}</div>
            <div className={"flex-col items-center text-center"}>
                <div className={"text-muted-foreground text-sm"}>Balance</div>
                <div>{getValueWithDecimals(parseInt(coinBalance.totalBalance), metadata.decimals, 2)}</div>
            </div>
            <div className={"flex-col items-center text-center"}>
                <div className={"text-muted-foreground text-sm"}>Value</div>
                <div>{sellPrice === 0 ? "?" : sellPrice} SUI</div>
            </div>
        </div>
        <div className="flex flex-col">
            <Link href={`/coin/${coinBalance.coinType.split('::')[0]}`}>
                <Button size="sm" variant={"link"}>View Coin</Button>
            </Link>
            <Link href={`https://suiscan.xyz/${ctx.network || "mainnet"}/account/${address}`} target="_blank"
                  rel="noopener noreferrer">
                <Button size="sm" variant={"link"}><ExternalLink className={"h-3 w-3 mr-1"}/>View on SuiScan</Button>
            </Link>
        </div>
    </div>);
}

const ProfilePage = () => {
    const ctx = useSuiClientContext();
    let {address} = useParams()
    const {toast} = useToast()
    address = address as string
    const {data: coins, isLoading, isError, error, refetch} = useSuiClientQuery('getAllBalances', {
        owner: address,
    })
    console.log("tokens will end up being", coins?.map(coin => coin.coinType.split("::")[0]) || [])
    const {
        data: coinsFromRestApi,
        isLoading: isLoadingFromRestApi,
        isError: isErrorFromRestApi,
        error: errorFromRestApi
    } = useFetchManyCoinsFromRest({
        packageIds: coins?.map(coin => coin.coinType.split("::")[0]) || [],
    })

    if (isLoading || isLoadingFromRestApi) {
        return <div>Loading...</div>
    }

    if (isError || isErrorFromRestApi) {
        return <div>Error: {((error || errorFromRestApi) as Error).message}</div>
    }

    if (!coins || !coinsFromRestApi) return <></>

    return (
        <div className="max-w-lg">
            <div className="overflow-x-scroll">
                <Jazzicon diameter={40} seed={jsNumberForAddress(address || "")}/>
                <div>
                    <span>Address: </span>
                    <span className="text-blue-500 cursor-pointer hover:underline"
                          onClick={() => {
                              copyTextToClipboard(address)
                              toast({
                                  title: "Copied address to clipboard",
                                  duration: 2000,
                              })
                          }
                          }>{address} </span>

                    <a className={"cursor-pointer hover:underline text-muted-foreground text-xs flex"}
                       href={`https://suiscan.xyz/${ctx.network}/account/${address}`}>
                        <ExternalLink className={"h-4 w-4 ml-auto"}/> View on SuiScan</a>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl mb-4">Coins Held</h2>
                <div className="space-y-2 gap-2">
                    {coins?.map((coin, index) => (
                        <CoinRow key={index} address={address} coinBalance={coin}
                                 coinFromRestApi={coinsFromRestApi.find((c) => c.packageId === coin.coinType.split("::")[0])}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;