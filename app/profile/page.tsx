'use client'
import {Button} from "@/components/ui/button";
import {useCurrentAccount, useSuiClientQuery} from "@mysten/dapp-kit";
import {FC} from "react";
import type {CoinBalance} from "@mysten/sui.js/client";
import {extractPriceFromDevInspect, getValueWithDecimals} from "@/lib/utils";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {Card} from "@/components/ui/card";
import {getSellCoinPriceTxb} from "@/components/BuySellDialog";

interface CoinRowProps {
    coinBalance: CoinBalance;
}

const CoinRow: FC<CoinRowProps> = ({coinBalance}) => {
    const currentAccount = useCurrentAccount();
    const {data: metadata, isLoading, isError, error} = useSuiClientQuery('getCoinMetadata', {
        coinType: coinBalance.coinType,
    })

    console.log(coinBalance.coinType)

    const {
        data: sellPrice,
        isLoading: isSellPriceLoading,
        isError: isSellPriceError,
        error: sellPriceError
    } = useSuiClientQuery('devInspectTransactionBlock', {
        transactionBlock: getSellCoinPriceTxb(coinBalance.coinType, currentAccount?.address || "", parseInt(coinBalance.totalBalance))  ,
        sender: currentAccount?.address || "",
    })

    if (isLoading || isSellPriceLoading) {
        return <div>Loading...</div>
    }

    if (isError || isSellPriceError) {
        return <div>Failed to load coin: {(error || sellPriceError as Error).message}</div>
    }

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
                <div>{extractPriceFromDevInspect(sellPrice)} SUI</div>
            </div>
        </div>
        <div className="flex space-x-2">
            {/*<Button variant="outline" size="sm">Refresh</Button>*/}
            {/*<Button variant="primary" size="sm">View Coin</Button>*/}
            <Button size="sm">View Coin</Button>
        </div>
    </div>)
}
const ProfilePage = () => {
    // const coins = [
    //     { name: 'smichi', amount: '12534.19 SOL' },
    //     { name: '1432', amount: '878.84 SOL' },
    //     { name: 'UNIDOG', amount: '3000000.00 SOL' },
    //     // Add other coins as per your list
    // ];
    const currentAccount = useCurrentAccount();
    const {data: coins, isLoading, isError, error, refetch} = useSuiClientQuery('getAllBalances', {
        owner: currentAccount?.address || "",
    })

    //Fetch metadata
    // useEffect(() => {
    //     if (!coins) return;
    //     const fetchMetadata = async () => {
    //         const res: Record<string, CoinMetadata> = {};
    //         for (let i = 0; i < coins.length; i++) {
    //             const coin = coins[i];
    //                 const metadata = await suiClient.getCoinMetadata({
    //                     coinType: coin.coinType,
    //                 });
    //                 if(metadata) {
    //                     res[coin.coinType] = metadata;
    //                 } else {
    //                     //TODO default
    //                 }
    //             }
    //         setCoinMetadatas(res);
    //     }
    //     fetchMetadata();
    // }, [coins])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Error: {(error as Error).message}</div>
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <div className="flex items-center space-x-4">
                <Jazzicon diameter={40} seed={jsNumberForAddress(currentAccount?.address || "")}/>
                {/*<Avatar*/}
                {/*    size="lg"*/}
                {/*    src="https://path/to/profile/image.jpg" // Replace with actual image URL*/}
                {/*    alt="Profile Picture"*/}
                {/*/>*/}
                <div>
                    {/*<h1 className="text-xl font-bold">@psyko</h1>*/}
                    {/*<p>Likes received: 85 | Mentions received: 10</p>*/}
                    <p>Address: {currentAccount?.address} </p>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-2xl mb-4">Coins Held</h2>
                <div className="space-y-2">
                    <Card className={"max-w-lg"}>
                        {coins?.map((coin, index) => (
                            <CoinRow key={index} coinBalance={coin}/>
                        ))}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;