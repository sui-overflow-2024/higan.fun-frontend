'use client';
import {CoinFromRestAPI, CoinStatus} from "@/lib/types";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {BuySellDialog} from "@/components/BuySellDialog";
import TradesTable from "@/components/TradesTable";
import LegacyTradesChart from "@/stories/LegacyTradesChart";
import useSWR from "swr";
import {CoinGetByIdKey, coinRestApi} from "@/lib/rest";
import {usePathname} from "next/navigation";
import {AppConfigContext, CurrentSuiPriceContext} from "@/components/Contexts";
import {CoinThread} from "@/components/CoinThread";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {getValueWithDecimals, suiToUsdLocaleString} from "@/lib/utils";
import {getTokenMetrics, TokenMetric, TokenMetricKey} from "@/lib/sui";
import {useContextSelector} from "use-context-selector";
import {SwapForm} from "@/components/SwapForm";
import {AddRemoveLiquidityDialog} from "@/components/AddRemoveLiquidityDialog";
import {CoinDetails} from "@/stories/CoinDetails";
import {TokenHolders} from "@/stories/TokenHolders";
import {SocialLinks} from "@/stories/SocialLinks";
import {useSuiClientContext} from "@mysten/dapp-kit";

type CoinMetadataProps = {
    token: CoinFromRestAPI;
    tokenMetrics?: TokenMetric,
};


const CoinMetadataHeader: FC<CoinMetadataProps> = ({tokenMetrics, token}) => {
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


const ActivePanelButtons: FC<{
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


    const {data: token, error: tokenError, mutate: refetchToken} = useSWR<CoinFromRestAPI, any, CoinGetByIdKey>(
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

    //TODO Refresh
    // useEffect(() => {
    //         console.log('posts in ws', posts)
    //
    //
    //         socket.on('', async (data) => {
    //             if (data.coinId !== bondingCurveId) return;
    //             console.log('new posts created', data)
    //             const newPosts = [data, ...posts || []]
    //             await refetchPosts(newPosts, false)
    //         });
    //
    //         return () => {
    //             socket.off('connect');
    //             socket.off('postCreated');
    //             socket.off('disconnect');
    //         };
    //     }, [posts, refetchPosts, socket]
    // );

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

    let showSwapForm = token.status === CoinStatus.CLOSE_IN_PROGRESS || token.status === CoinStatus.CLOSED;
    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <div className="container mx-auto">

                <main className="grid grid-cols-3 gap-8 mt-4">
                    <section className="col-span-2 space-y-4">
                        <CoinMetadataHeader tokenMetrics={tokenMetrics} token={token}/>
                        <div className="bg-gray-700 min-h-[300px]">
                            <LegacyTradesChart bondingCurveId={token.bondingCurveId}/>
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
                        {showSwapForm && <SwapForm suiClient={suiContext.client} token={token}/>}
                        {showSwapForm && <AddRemoveLiquidityDialog token={token}/>}
                        {!showSwapForm &&
                            <BuySellDialog token={token} tokenMetrics={tokenMetrics} suiClient={suiContext.client}/>}
                        <CoinDetails tokenMetrics={tokenMetrics} token={token}/>
                        <TokenHolders token={token} tokenMetrics={tokenMetrics}/>
                    </aside>
                </main>
            </div>
        </div>
    );
}
