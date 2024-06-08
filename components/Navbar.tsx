import Link from 'next/link';
import {ConnectButton, useCurrentAccount, useSuiClientContext} from '@mysten/dapp-kit';
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {usePathname} from "next/navigation";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import HiganFunLogoText from "@/public/higan-fun-logo-text.svg";
import HiganFunLogo from "@/public/higan-fun-logo.svg";
import Image from "next/image";
import {useEffect, useState} from "react";
import {AppConfigContext} from "@/components/Contexts";
import {CoinFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {coinRestApi} from "@/lib/rest";
import {useContextSelector} from 'use-context-selector'; // Import the useContextSelector hook

function NetworkSelector() {
    const ctx = useSuiClientContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className={"min-w-24"}>
                    {ctx.network}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {Object.keys(ctx.networks).map((network) => (
                    <DropdownMenuItem
                        key={network}
                        onChange={(e) => ctx.selectNetwork(network)}
                    >
                        {network}
                    </DropdownMenuItem>

                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const NewTradeNotification = ({trade, coin}: { trade?: TradeFromRestAPI, coin?: CoinFromRestAPI }) => {
    if (!coin || !trade) return <></>;

    return <Link href={`/coin/${coin.bondingCurveId}`}>
        <div
            className={"text-xs p-2 border-2 rounded-lg flex gap-2 items-center hover:cursor-pointer hover:bg-secondary"}>
            <CreatorAddressChip address={coin.creator || "ffffff"}
                                showAvatar={false}
                                variant={"small"}/>
            <span
                className={"line-clamp-1"}>traded {(trade.coinAmount * Math.pow(10, -1 * coin.decimals)).toFixed(4)} of {coin.symbol}</span>
            <img src={coin.iconUrl} alt={coin.symbol} className={"w-6 h-6"}/>

        </div>
    </Link>
}

const NewCoinNotification = ({coin}: { coin?: CoinFromRestAPI }) => {
    if (!coin) return <></>;

    return <Link href={`/coin/${coin.bondingCurveId}`}>
        <div
            className={"text-xs p-2 border-2 rounded-lg flex gap-2 items-center hover:cursor-pointer hover:bg-secondary"}>
            <CreatorAddressChip address={coin.creator || "ffffff"}
                                showAvatar={false}
                                variant={"small"}/>
            <span className={"line-clamp-1"}>created {coin.symbol}</span>
            <img src={coin.iconUrl} alt={coin.symbol} className={"w-6 h-6"}/>
        </div>
    </Link>
}


export default function Navbar() {
    const account = useCurrentAccount();
    const pathname = usePathname();
    const socket = useContextSelector(AppConfigContext, (context) => context.socket); // Use useContextSelector to subscribe only to the socket property
    const axios = useContextSelector(AppConfigContext, (context) => context.axios); // Use useContextSelector to subscribe only to the socket property

    const [mostRecentTrade, setMostRecentTrade] = useState<{
        trade: TradeFromRestAPI,
        coin: CoinFromRestAPI
    } | undefined>(undefined);
    const [mostRecentCoin, setMostRecentCoin] = useState<CoinFromRestAPI | undefined>(undefined);
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('coinCreated', (data) => {
            console.log('Token created nav posts:', data);
            setMostRecentCoin(data)
        });

        socket.on('tradeCreated', (data) => {
            console.log('Trade made nav posts:', data);
            setMostRecentTrade(data);
        });


        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        return () => {
            socket.off('connect');
            socket.off('coinCreated');
            socket.off('tradeCreated');
            socket.off('disconnect');
        };
    }, [socket]);


    useEffect(() => {
        const initialFetch = async () => {
            const mostRecentCoin = await coinRestApi.getAll({axios, limit: 1, order: "desc", path: "getAll"});
            const mostRecentTrade = await coinRestApi.getTrades({
                axios: axios,
                limit: 1,
                order: "desc",
                path: "getTrades"
            });
            setMostRecentCoin(mostRecentCoin[0]);
            setMostRecentTrade({trade: mostRecentTrade[0], coin: mostRecentCoin[0]});
        }
        initialFetch()
        //TODO on initial load we should fetch the most recent coin and trade from the REST API
    }, [axios]);

    console.log("mostRecentCoin", mostRecentCoin)

    return (
        <nav className="border-b-2 border-gray-800">
            <div className="container mx-auto">
                <div className="flex items-center h-16">
                    <div className="flex items-center gap-2">
                        <Link href="/" className={"flex items-center"}>
                            <Image width={24} height={24} src={HiganFunLogoText} alt="logo"
                                   className="min-w-36 h-8 hidden md:block"/>
                            <Image width={24} height={24} src={HiganFunLogo} alt="logo"
                                   className="min-w-16 h-8 block md:hidden"/>
                        </Link>
                        <Link href="/">
                            <Button
                                className={pathname === "/" ? "text-primary underline" : "text-white"}
                                variant={"link"}>
                                Home
                            </Button>
                        </Link>
                        <Link href="/create">

                            <Button
                                className={pathname === "/create" ? "text-primary underline" : "text-white"}
                                variant={"link"}>
                                Launch Token
                            </Button>
                        </Link>

                        <NewTradeNotification trade={mostRecentTrade?.trade} coin={mostRecentTrade?.coin}/>
                        <NewCoinNotification coin={mostRecentCoin}/>
                    </div>
                    <div className="ml-auto">
                        <div className="flex items-center gap-2">
                            <div>
                                {account &&
                                    <CreatorAddressChip address={account.address} variant={"large"} showAvatar/>
                                }
                            </div>
                            <ConnectButton
                                className={"bg-primary text-primary-foreground shadow hover:bg-primary/90"}
                                style={{padding: "0.5rem 1rem"}}
                            />
                            {/*<NetworkSelector/>*/}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
