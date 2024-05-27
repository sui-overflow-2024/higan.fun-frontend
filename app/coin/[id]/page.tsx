'use client';
import {TokenFromRestAPI} from "@/lib/types";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, SetStateAction, useContext, useEffect, useRef, useState} from "react";
import twitterLogo from '@/public/x.svg';
import discordLogo from '@/public/discord.svg';
import telegramLogo from '@/public/telegram.svg';
import webLogo from '@/public/web.svg';
import suiLogo from '@/public/sui-sea.svg';
import Image from "next/image";
import {BuySellDialog} from "@/components/BuySellDialog";
import TradesTable from "@/components/TradesTable";
import TradesChart from "@/components/TradesChart";
import {faker} from "@faker-js/faker";
import useSWR from "swr";
import {coinRestApi} from "@/lib/rest";
import {usePathname} from "next/navigation";
import {AppConfig, AppConfigContext, CurrentSuiPriceContext} from "@/components/Contexts";
import {useCurrentAccount, useSuiClientContext} from "@mysten/dapp-kit";
import {CoinThread} from "@/components/CoinThread";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {getMarketCap} from "@/lib/utils";

type CoinMetadataProps = {
    token: TokenFromRestAPI;
    marketCap: string;
    currentSuiPrice: number;
};
type CoinDetailsProps = {
    token: TokenFromRestAPI;
    marketCap: string;
};
type Holder = {
    address: string;
    balance: number;
};

type TokenHoldersProps = {
    token: TokenFromRestAPI;
    holders: Holder[];
    totalSupply: number;
};


const ClampedDescription = ({text}: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (textRef.current && containerRef.current) {
            // @ts-ignore
            const textHeight = textRef.current.scrollHeight;
            // @ts-ignore
            const containerHeight = containerRef.current.clientHeight;

            if (textHeight > containerHeight) {
                setIsOverflowing(true);
            }
        }
    }, []);

    return (
        <div>
            <div
                ref={containerRef}
                className={`${isExpanded ? '' : 'line-clamp-4'} overflow-hidden text-sm text-gray-400`}
                style={{maxHeight: isExpanded ? 'none' : '7.2rem'}} // 4 lines height approximation
            >
                <div ref={textRef}>{text}</div>
            </div>
            {isOverflowing && (
                <button
                    className="mt-2 text-blue-500 hover:underline"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            )}
        </div>
    );
};

const CoinMetadataHeader: React.FC<CoinMetadataProps> = ({token, marketCap, currentSuiPrice}) => {
    // TODO: fetch token price
    let currentPrice = 1;

    return (
        <div className="p-2 flex justify-between items-center rounded-lg">
            <div className="flex items-center space-x-4">
                <Image
                    src={token.iconUrl || 'https://via.placeholder.com/40'}
                    alt={token.name}
                    width={10}
                    height={10}
                    className="w-10 h-10"
                />
                <h2 className="text-lg font-bold">{token.name} (${token.symbol})</h2>
            </div>
            <div className="flex items-center space-x-8">
                <span
                    className="text-green-400 text-sm">Market Cap: ${(marketCap).toLocaleString()}</span>
                <span
                    className="text-green-400 text-sm">Current Price: {currentPrice} SUI (${currentSuiPrice.toFixed(2)})</span>
                <div className="flex items-center space-x-2 text-sm">
                    <span>Created by:</span>
                    <CreatorAddressChip address={token.creator} variant={"default"} showAvatar/>
                </div>
            </div>
        </div>
    );
};


const ActivePanelButtons: React.FC<{
    activePanel: string,
    setActivePanel: Dispatch<SetStateAction<"thread" | "trades">>
}> = ({activePanel, setActivePanel}) => {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
                <Button
                    size={'sm'}
                    onClick={() => setActivePanel('thread')}
                    variant={activePanel === 'thread' ? 'default' : 'outline'}
                >
                    Thread
                </Button>

                <Button
                    size={'sm'}
                    onClick={() => setActivePanel('trades')}
                    variant={activePanel === 'trades' ? 'default' : 'outline'}
                >
                    Trades
                </Button>
            </div>
        </div>
    );
};

const SocialLinks: React.FC<{ token: TokenFromRestAPI }> = ({token}) => {
    const ctx = useSuiClientContext();
    return (

        <div className="flex space-x-4 items-center justify-center">
            <a href={token.website} target="_blank" rel="noopener noreferrer">
                <Image src={webLogo} alt="Website" width={30} height={30}/>
            </a>
            <a href={token.twitterUrl} target="_blank" rel="noopener noreferrer">
                <Image src={twitterLogo} alt="Twitter" width={30} height={30}/>
            </a>
            <a href={token.telegramUrl} target="_blank" rel="noopener noreferrer">
                <Image src={telegramLogo} alt="Telegram" width={30} height={30}/>
            </a>
            <a href={token.discordUrl} target="_blank" rel="noopener noreferrer">
                <Image src={discordLogo} alt="Telegram" width={30} height={30}/>
            </a>
            {/*TODO below className w-5 is a hack, couldn't get the image to work with just width and height*/}
            <a href={`https://suiscan.xyz/${ctx.network || "mainnet"}/coin/${token.packageId}`} target="_blank">
                <Image src={suiLogo} alt={"SuiScan"} width={30} height={30} className={"w-5"}/>
            </a>

        </div>
    );
};


// // Stub useQuery hook for totalSupply
// const useTotalSupply = () => {
//     return useQuery('totalSupply', async () => {
//         // Simulate an API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return 21000; // Example total supply
//     });
// };

const CoinDetails: React.FC<CoinDetailsProps> = ({token, marketCap}) => {
    const bondingCurveProgress = 2; // Example progress percentage
    const target = 900000; // Example target market cap
    const totalSupply = Math.floor(Math.random() * 1000000); // Example total supply
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="p-4 rounded-lg">
            <div className="flex items-start space-x-4">
                <div className="border border-gray-700 min-w-24 min-h-24 align-middle">
                    <Image
                        src={token.iconUrl || 'https://via.placeholder.com/100'}
                        alt={token.name}
                        width={100}
                        height={100}
                        className={"w-24 h-24"}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{token.name} ({token.symbol})</h2>
                    <ClampedDescription text={token.description}/>
                </div>
            </div>
            <div className="mt-4">
                <div className="text-gray-400 mb-2 text-sm">Bonding curve progress: {bondingCurveProgress}%</div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{width: `${bondingCurveProgress}%`}}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between text-green-400 mt-4 text-sm">
                <div>Market Cap: ${marketCap.toLocaleString()}</div>
                <div>Target: ${target.toLocaleString()}</div>
            </div>
            <div className="text-gray-400 mt-2 text-sm">
                Total Supply: {totalSupply.toLocaleString()}
            </div>
        </div>
    );
};


const bondingCurveAddress = 'abcdef';

const TokenHolders: React.FC<TokenHoldersProps> = ({token, holders, totalSupply}) => {
    // Sort holders by balance in descending order and take the top 20
    const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance).slice(0, 20);

    return (
        <div className="p-2 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Whales</h2>
            <ul className="list-decimal list-inside">
                {sortedHolders.map((holder, index) => (
                    <li key={holder.address} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span>{index + 1}. {holder.address.slice(2, 8)}</span>
                            {holder.address === token.creator && <span className="text-gray-400 text-sm">(dev)</span>}
                            {holder.address === bondingCurveAddress &&
                                <span className="text-gray-400 text-sm">🏛 (bonding curve)</span>}
                        </div>
                        <span>{((holder.balance / totalSupply) * 100).toFixed(1)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default function Drilldown() {
    const appConfig = useContext(AppConfigContext)
    const [activePanel, setActivePanel] = useState<"thread" | "trades">('thread');
    const packageId = usePathname().split('/').pop() || '';
    const account = useCurrentAccount()
    const suiContext = useSuiClientContext()

    const currentSuiPrice = useContext(CurrentSuiPriceContext)
    const {data: token, error: tokenError} = useSWR<TokenFromRestAPI, any, {
        appConfig: AppConfig,
        packageId: string,
        path: "getById"
    }>({appConfig, packageId, path: "getById"}, coinRestApi.getById)


    const exampleHolders: Holder[] = [
        {address: 'abcdef', balance: 700000}, // Example holder with bonding curve
        {address: faker.finance.ethereumAddress(), balance: 100000}, // Example creator
        {address: faker.finance.ethereumAddress(), balance: 100000},
        {address: account?.address || faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        {address: faker.finance.ethereumAddress(), balance: 50000},
        // Add more holders as needed
    ];


    if (tokenError) return (<div>Error fetching token {tokenError.message}</div>)
    if (!token) return (<div>Loading...</div>)


    const totalSupply = exampleHolders.reduce((acc, holder) => acc + holder.balance, 0);
    let marketCap = getMarketCap(token.suiReserve, currentSuiPrice);

    return (
        // <div className="bg-gray-700 p-4 min-h-[300px] flex items-center justify-center">
        // <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <div className="container mx-auto">

                <main className="grid grid-cols-3 gap-8 mt-4">
                    <section className="col-span-2 space-y-4">
                        <CoinMetadataHeader token={token} marketCap={marketCap} currentSuiPrice={currentSuiPrice}/>
                        <div className="bg-gray-700 min-h-[300px]">
                            <TradesChart packageId={token.packageId}/>
                        </div>

                        <div className="flex justify-between p-2">
                            <div className="flex space-x-4">
                                <ActivePanelButtons activePanel={activePanel} setActivePanel={setActivePanel}/>
                            </div>
                            <div className="flex space-x-4">
                                <SocialLinks token={token}/>
                            </div>
                        </div>
                        <div className="p-2">
                            {activePanel === 'thread'
                                ? <CoinThread creator={token.creator || ""} packageId={packageId}/>
                                : <TradesTable coinSymbol={token.symbol}
                                               packageId={packageId}
                                               network={suiContext.network || "mainnet"}/>}

                        </div>
                    </section>


                    <aside className="space-y-4">
                        <BuySellDialog token={token}/>
                        <CoinDetails token={token} marketCap={marketCap}/>
                        <TokenHolders token={token} holders={exampleHolders} totalSupply={totalSupply}/>
                    </aside>
                </main>
            </div>
        </div>
        // </main>
    );
}