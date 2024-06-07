'use client';
import {CoinFromRestAPI, HoldersFromRestAPI} from "@/lib/types";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import twitterLogo from '@/public/x.svg';
import discordLogo from '@/public/discord.svg';
import telegramLogo from '@/public/telegram.svg';
import webLogo from '@/public/web.svg';
import suiLogo from '@/public/sui-sea.svg';
import Image from "next/image";
import {BuySellDialog} from "@/components/BuySellDialog";
import TradesTable from "@/components/TradesTable";
import TradesChart from "@/components/TradesChart";
import useSWR from "swr";
import {CoinGetByIdKey, CoinGetHoldersByKey, coinRestApi} from "@/lib/rest";
import {usePathname} from "next/navigation";
import {AppConfigContext, CurrentSuiPriceContext} from "@/components/Contexts";
import {useSuiClientContext} from "@mysten/dapp-kit";
import {CoinThread} from "@/components/CoinThread";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {getValueWithDecimals, suiToUsdLocaleString} from "@/lib/utils";
import {getTokenMetrics, TokenMetric, TokenMetricKey} from "@/lib/sui";
import {useContextSelector} from "use-context-selector";

type CoinMetadataProps = {
    token: CoinFromRestAPI;
    tokenMetrics?: TokenMetric,
};
type CoinDetailsProps = {
    token: CoinFromRestAPI;
    tokenMetrics?: TokenMetric,
};

type TokenHoldersProps = {
    token: CoinFromRestAPI;
    tokenMetrics?: TokenMetric;
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

const CoinMetadataHeader: React.FC<CoinMetadataProps> = ({tokenMetrics, token}) => {
    const currentSuiPrice = useContextSelector(CurrentSuiPriceContext, v => v);

    if (!tokenMetrics) return
    let {tokenPrice} = tokenMetrics;
    let marketCap = suiToUsdLocaleString(tokenMetrics?.suiBalance || 0, currentSuiPrice);


    return (
        <div className="flex justify-between items-center rounded-lg">
            <div className="flex items-center space-x-4">
                <img
                    src={token.iconUrl || "./public/garfield.png"}
                    alt={token.name}
                    width={10}
                    height={10}
                    className="w-10 h-10"
                />
                <p className="text-lg font-bold">{token.name} (${token.symbol})</p>
            </div>
            <div className={"flex-col text-center text-green-400 text-sm"}>
                <div>Market Cap:</div>
                <div>{marketCap.toLocaleString()}</div>
            </div>
            <div className={"flex-col text-center text-green-400 text-sm"}>
                <div>Current Price:</div>
                <div className={"space-x-1"}>
                    <span>{getValueWithDecimals(tokenPrice, 9, 4)} SUI</span>
                    <span>(~{suiToUsdLocaleString(tokenPrice, currentSuiPrice)})</span>
                </div>
            </div>
            <div className="flex-col items-center space-x-2 text-sm">
                <div className="flex-col text-center text-sm">
                    <div>Created by:</div>
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

const SocialLinks: React.FC<{ token: CoinFromRestAPI }> = ({token}) => {
    const ctx = useSuiClientContext();
    return (

        <div className="flex space-x-4 items-center justify-center">
            <a href={token.websiteUrl} target="_blank" rel="noopener noreferrer">
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
            <a href={`https://suiscan.xyz/${ctx.network || "mainnet"}/object/${token.packageId}`} target="_blank">
                <Image src={suiLogo} alt={"SuiScan"} width={30} height={30} className={"w-5"}/>
            </a>

        </div>
    );
};


const CoinDetails: React.FC<CoinDetailsProps> = ({token, tokenMetrics}) => {

    const currentSuiPrice = useContextSelector(CurrentSuiPriceContext, v => v);
    if (!tokenMetrics) return (<div>Loading...</div>)


    const target = token.target; // Example target market cap
    const totalSupply = tokenMetrics.totalSupply;
    const bondingCurveProgress = Math.min((tokenMetrics.suiBalance / target) * 100, 100).toFixed(2);
    const targetUSD = getValueWithDecimals(target * currentSuiPrice, 9, 2);
    const totalSupplyWithDecimals = totalSupply * (Math.pow(10, -1 * token.decimals));
    let marketCap = suiToUsdLocaleString(tokenMetrics?.suiBalance || 0, currentSuiPrice);

    return (
        <div className="p-4 rounded-lg">
            <div className="flex items-start space-x-4">
                <div className="border border-gray-700 min-w-24 min-h-24 align-middle">
                    <img
                        src={token.iconUrl || 'https://via.placeholder.com/100'}
                        alt={token.name}
                        width={100}
                        height={100}
                        className={"w-24 h-24"}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{token.name} (${token.symbol})</h2>
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
                <div>Market Cap: {marketCap.toLocaleString()}</div>
                <div>Target: ${targetUSD}</div>
            </div>
            <div className="text-gray-400 mt-2 text-sm">
                Total Supply: {totalSupplyWithDecimals.toLocaleString()} {token.symbol}
            </div>
        </div>
    );
};


const TokenHolders: React.FC<TokenHoldersProps> = ({token, tokenMetrics}) => {
    // Sort holders by balance in descending order and take the top 20
    const axios = useContextSelector(AppConfigContext, (v) => v.axios);

    const totalSupply = tokenMetrics?.totalSupply || 0;
    const {data: holders, error: holdersError} = useSWR<HoldersFromRestAPI[], any, CoinGetHoldersByKey>(
        {axios, bondingCurveId: token.bondingCurveId, path: "getHolders"}, coinRestApi.getHolders)


    if (!tokenMetrics) return (<div>Loading token metrics...</div>)
    if (holdersError) return (<div>Error fetching holders</div>)
    if (!holders) return (<div>Loading holders</div>)

    const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance).slice(0, 20);

    return (
        <div className="p-2 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Top Holders</h2>
            <ol className="list-decimal list-inside">
                {sortedHolders.map((holder, index) => (
                    <li key={holder.address} className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <span>{index + 1}.</span>
                            <CreatorAddressChip address={holder.address} isCreator={holder.address === token.creator}
                                                variant={"small"}/>
                        </div>
                        <span>{((holder.balance / totalSupply) * 100).toFixed(1)}%</span>
                    </li>
                ))}
            </ol>
        </div>
    );
};


export default function Drilldown() {
    const {
        axios,
        managerContractPackageId,
        managerContractModuleName,
        socket,
        longInterval
    } = useContextSelector(AppConfigContext, (v) => ({
        axios: v.axios,
        socket: v.socket,
        longInterval: v.longInterval,
        managerContractPackageId: v.managerContractPackageId,
        managerContractModuleName: v.managerContractModuleName,
    }));
    const [activePanel, setActivePanel] = useState<"thread" | "trades">('thread');
    const bondingCurveId = usePathname().split('/').pop() || '';
    const suiContext = useSuiClientContext()
    const fallbackDevInspectAddress = useContextSelector(AppConfigContext, v => v.fallbackDevInspectAddress)

    const {data: token, error: tokenError} = useSWR<CoinFromRestAPI, any, CoinGetByIdKey>(
        {axios, bondingCurveId, path: "getById"}, coinRestApi.getById)

    const {
        data: tokenMetrics,
        error: fetchTokenMetricsError,
        isLoading: isLoadingTokenPrice,
        mutate: refetchTokenMetrics
    } = useSWR<TokenMetric, any, TokenMetricKey>(
        {
            managerContractPackageId,
            managerContractModuleName,
            client: suiContext.client,
            sender: fallbackDevInspectAddress,
            coin: token,
            path: "tokenMetrics",
        }, getTokenMetrics, {refreshInterval: longInterval});
    useEffect(() => {
            socket.on('tradeCreated', async (data) => {
                await refetchTokenMetrics()
            });
            return () => {
                socket.off('connect');
                socket.off('postCreated');
                socket.off('disconnect');
            };
        }, [refetchTokenMetrics, socket]
    );

    if (tokenError) return (<div>Error fetching token {tokenError.message}</div>)

    // probably token metrics should be part of the token
    if (!token || !tokenMetrics) return (<div>Loading token...</div>)


    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <div className="container mx-auto">

                <main className="grid grid-cols-3 gap-8 mt-4">
                    <section className="col-span-2 space-y-4">
                        <CoinMetadataHeader tokenMetrics={tokenMetrics} token={token}/>
                        <div className="bg-gray-700 min-h-[300px]">
                            <TradesChart bondingCurveId={token.bondingCurveId}/>
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
                                ? <CoinThread creator={token.creator || ""} bondingCurveId={token.bondingCurveId}/>
                                : <TradesTable coinSymbol={token.symbol}
                                               bondingCurveId={token.bondingCurveId}
                                               network={suiContext.network || "mainnet"}/>}

                        </div>
                    </section>


                    <aside className="space-y-4">
                        <BuySellDialog token={token} tokenMetrics={tokenMetrics} suiClient={suiContext.client}/>
                        <CoinDetails tokenMetrics={tokenMetrics} token={token}/>
                        <TokenHolders token={token} tokenMetrics={tokenMetrics}/>
                    </aside>
                </main>
            </div>
        </div>
    );
}
