import React, {FC, useEffect, useState} from 'react';
import {formatDistanceToNow} from "date-fns";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {getValueWithDecimals} from "@/lib/utils";
import {CoinGetTradesKey, coinRestApi} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
import useSWR from "swr";
import {TradeFromRestAPI} from "@/lib/types";
import {useContextSelector} from "use-context-selector";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

type TradesListProps = {
    bondingCurveId: string;
    coinSymbol: string;
    network: string;
};


// Component for the trades.ts list
const TradesList: FC<TradesListProps> = ({bondingCurveId, coinSymbol, network}) => {
    const axios = useContextSelector(AppConfigContext, v => v.axios);
    const socket = useContextSelector(AppConfigContext, v => v.socket);
    const longInterval = useContextSelector(AppConfigContext, v => v.longInterval);
    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    let {
        data: trades,
        error: fetchTradesError,
        mutate: refetchTrades
    } = useSWR<TradeFromRestAPI[], any, CoinGetTradesKey>({
        axios,
        bondingCurveId,
        limit: limit + 1,
        offset,
        path: "getTrades"
    }, coinRestApi.getCoinTrades, {refreshInterval: longInterval});

    let hasNextPage = false;

    useEffect(() => {
            socket.on('tradeCreated', async (data) => {
                if (data.coin.bondingCurveId !== bondingCurveId) return;
                console.log('new trade created, trade chart', data)
                const newTrades = [data.trade, ...trades || []]
                await refetchTrades(newTrades, false)
            });

            return () => {
                socket.off('tradeCreated');
            };
        }, [bondingCurveId, refetchTrades, socket, trades]
    );

    useEffect(() => {
        refetchTrades(undefined, true);
    }, [offset, refetchTrades]);

    const handlePagePreviousClick = (e: any) => {
        e.preventDefault();

        setOffset(Math.max(0, offset - limit));
    }

    const handlePageNextClick = (e: any) => {
        e.preventDefault();
        if (!hasNextPage) return;

        setOffset(offset + limit);
    }

    if (!trades) return <div>Loading trades...</div>
    if (fetchTradesError) return <div>Failed to load trades {fetchTradesError}</div>
    let currentPage = offset / limit + 1;
    hasNextPage = trades.length > limit;
    trades = trades.slice(0, limit);

    return (
        <div className="w-full">
            <div className="flex bg-gray-800 text-gray-200 p-2 rounded-t-lg">
                <div className="flex-1 px-4 text-center">Account</div>
                <div className="w-1/6 px-4 text-center">Activity</div>
                <div className="w-1/6 px-4 text-center">SUI</div>
                <div className="w-1/6 px-4 text-center">{coinSymbol}</div>
                <div className="w-1/6 px-4 text-center">Date</div>
                <div className="w-1/6 px-4 text-center">Transaction</div>
            </div>
            {/*TODO figure out why sort order is lost after being fetched from REST API*/}
            {trades.sort((a, b) => a.createdAt > b.createdAt ? -1 : 1).map((trade, index) => {
                return (
                    <div key={index} className="flex items-center bg-gray-700 hover:bg-gray-600 p-2 my-1 rounded-lg">
                        <div className="flex-1 flex items-center justify-center space-x-2 px-4">
                            <CreatorAddressChip address={trade.account} showAvatar={true} variant={"small"}/>
                        </div>
                        <div className="w-1/6 text-sm text-center px-4">
                        <span className={trade.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {trade.isBuy ? 'Buy' : 'Sell'}
                        </span>
                        </div>
                        <div
                            className="w-1/6 text-sm text-center px-4">{getValueWithDecimals(trade.suiAmount, 9, 4)}</div>
                        <div
                            className="w-1/6 text-sm text-center px-4">{getValueWithDecimals(trade.coinAmount, 3)}</div>
                        <div className="w-1/6 text-sm text-center px-4">
                            {formatDistanceToNow(new Date(trade.createdAt), {addSuffix: true})}
                        </div>
                        <div className="w-1/6 text-sm text-center px-4">
                            <a
                                href={`https://suiscan.xyz/${network}/tx/${trade.transactionId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                            >
                                {trade.transactionId.slice(0, 6)}
                            </a>
                        </div>
                    </div>
                )
            })}

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={handlePagePreviousClick}/>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href="#" onClick={handlePageNextClick}/>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default TradesList