'use client'
import {Button} from "@/components/ui/button";
import {useSuiClient, useSuiClientQuery} from "@mysten/dapp-kit";
import {FC, useEffect, useState} from "react";
import type {CoinBalance} from "@mysten/sui.js/client";
import {extractPriceFromDevInspect, getValueWithDecimals} from "@/lib/utils";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {Card} from "@/components/ui/card";
import {getSellCoinPriceTxb} from "@/components/BuySellDialog";
import {useFetchManyCoinsFromRest} from "@/hooks/useFetchManyCoinsFromRest";
import {useParams} from "next/navigation";
import {TokenFromRestAPI} from "@/lib/types";

interface CoinRowProps {
    address: string;
    coinBalance: CoinBalance;
    coinFromRestApi?: TokenFromRestAPI;
}

const CoinRow: FC<CoinRowProps> = ({address, coinBalance, coinFromRestApi}) => {


    const suiClient = useSuiClient()
    const {data: metadata, isLoading, isError, error} = useSuiClientQuery('getCoinMetadata', {
        coinType: coinBalance.coinType,
    })

    const [sellPrice, setSellPrice] = useState<number>(0)


    useEffect(() => {
        const fetchCurrentPrice = async () => {
            const path = coinFromRestApi ? `${coinFromRestApi.packageId}::${coinFromRestApi.storeId}` : coinBalance.coinType.split("::").slice(0, 2).join("::")
            console.log("path: ", path)
            const price = await suiClient.devInspectTransactionBlock({
                transactionBlock: getSellCoinPriceTxb(coinBalance.coinType, coinFromRestApi?.storeId || "", parseInt(coinBalance.totalBalance)),
                sender: address,
            })
            console.log("price", price)
            setSellPrice(extractPriceFromDevInspect(price))
        }
        fetchCurrentPrice()
    }, [])

    // console.log(coinBalance.coinType),
    //     console.log("coinBalance", coinBalance)
    // const {
    //     data: sellPrice,
    //     isLoading: isSellPriceLoading,
    //     isError: isSellPriceError,
    //     error: sellPriceError
    // } = useSuiClientQuery('devInspectTransactionBlock', {
    //     transactionBlock:,
    //     sender: currentAccount?.address || "",
    // })

    // if (isLoading || isSellPriceLoading) {
    //     return <div>Loading...</div>
    // }

    // /if (isError || isSellPriceError) {
    //     return <div>Failed to load coin: {(error || sellPriceError as Error).message}</div>
    // }

    // For now just hide missing metadata
    if (!metadata) return <></>
    console.log("metadata", metadata)
    // (<div>Metadata not found</div>)

    return (<div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
            {metadata.iconUrl ? <img
                src={metadata.iconUrl} // Replace with actual coin image URL
                alt={metadata.name}
            /> : <Jazzicon diameter={40} seed={jsNumberForAddress(coinBalance.coinType)}/>}
            <div>{metadata.name}</div>
            <div>
                <div>{getValueWithDecimals(parseInt(coinBalance.totalBalance), metadata.decimals, 2)}</div>
                {/*<div>{extractPriceFromDevInspect(sellPrice)} SUI</div>*/}
                <div>{sellPrice} SUI</div>
            </div>
        </div>
        <div className="flex space-x-2">
            {/*<Button variant="outline" size="sm">Refresh</Button>*/}
            {/*<Button variant="primary" size="sm">View Coin</Button>*/}
            <Button size="sm">View Coin</Button>
        </div>
    </div>);
}
const ProfilePage = () => {
    // const coins = [
    //     { name: 'smichi', amount: '12534.19 SOL' },
    //     { name: '1432', amount: '878.84 SOL' },
    //     { name: 'UNIDOG', amount: '3000000.00 SOL' },
    //     // Add other coins as per your list
    // ];

    let {address} = useParams()
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

        <div className="container mx-auto p-4 text-white">
            <div className="flex items-center space-x-4">
                <Jazzicon diameter={40} seed={jsNumberForAddress(address || "")}/>
                {/*<Avatar*/}
                {/*    size="lg"*/}
                {/*    src="https://path/to/profile/image.jpg" // Replace with actual image URL*/}
                {/*    alt="Profile Picture"*/}
                {/*/>*/}
                <div>
                    {/*<h1 className="text-xl font-bold">@psyko</h1>*/}
                    {/*<p>Likes received: 85 | Mentions received: 10</p>*/}
                    <p>Address: {address} </p>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl mb-4">Coins Held</h2>
                <div className="space-y-2">
                    <Card className={"max-w-lg"}>
                        {coins?.map((coin, index) => (
                            <CoinRow key={index} address={address} coinBalance={coin}
                                     coinFromRestApi={coinsFromRestApi.find((c) => c.packageId === coin.coinType.split("::")[0])}/>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;