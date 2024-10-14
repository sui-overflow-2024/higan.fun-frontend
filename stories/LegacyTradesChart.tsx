import React, {FC, useEffect, useRef} from 'react';
import {ColorType, createChart, IChartApi, ISeriesApi, PriceScaleMode} from 'lightweight-charts';
import {TradeFromRestAPI} from '@/lib/types';
import useSWR from "swr";
import {CoinGetTradesKey, coinRestApi} from "@/lib/rest";
import {AppConfigContext, CurrentSuiPriceContext} from "@/components/Contexts";
import {useContextSelector} from "use-context-selector";


type TradesChartProps = {
    // trades.ts: TradeFromRestAPI[],
    bondingCurveId: string;
    // coinSymbol: string;
    // network: string;
};

const transformTradesToLineData = (trades: TradeFromRestAPI[], currentSuiPrice: number) => {
    const sortedTrades = trades.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const aggregatedData = sortedTrades.reduce((acc, trade) => {
        let time = new Date(trade.createdAt).getTime() / 1000; // Convert to seconds
        let tokenPrice = (trade.coinPrice * currentSuiPrice) * Math.pow(10, -9);

        if (!acc[time]) {
            acc[time] = {time, priceSum: 0, count: 0};
        }

        acc[time].priceSum += tokenPrice;
        acc[time].count += 1;

        return acc;
    }, {} as any);


    return Object.values(aggregatedData).map((entry: any) => ({
        time: entry.time,
        value: entry.priceSum / entry.count  // Calculate average price
    }));
};

const chartStyle: any = {
    backgroundColor: '#1F2937',
    lineColor: '#2962FF',
    textColor: 'white',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
}
// Component for the trades.ts list
const LegacyTradesChart: FC<TradesChartProps> = ({bondingCurveId}) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi>();
    const seriesRef = useRef<ISeriesApi<"Line">>();
    const previousTradesRef = useRef<TradeFromRestAPI[]>([]);
    const currentSuiPrice = useContextSelector(CurrentSuiPriceContext, v => v);
    const axios = useContextSelector(AppConfigContext, v => v.axios);
    const socket = useContextSelector(AppConfigContext, v => v.socket);

    const {
        data: trades,
        error: fetchTradesError,
        mutate: refetchTrades
    } = useSWR<TradeFromRestAPI[], any, CoinGetTradesKey>({
        axios,
        bondingCurveId: bondingCurveId,
        path: "getTrades"
    }, coinRestApi.getCoinTrades);

    useEffect(() => {
            socket.on('tradeCreated', async (data) => {
                if (data.coin.bondingCurveId !== bondingCurveId) return;
                console.log('new trade created, trade chart', data)
                const newTrades = [data.trade, ...trades || []]
                await refetchTrades(newTrades, false)
            });

            return () => {
                socket.off('postCreated');
            };
        }, [bondingCurveId, refetchTrades, socket, trades]
    );

    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }
        if (!trades) return;
        if (currentSuiPrice === 0) return;

        chartRef.current = createChart(chartContainerRef.current, {
            layout: {
                background: {type: ColorType.Solid, color: chartStyle.backgroundColor},
                textColor: chartStyle.textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            localization: {
                priceFormatter: (price: number) => price.toFixed(9),
            },
            rightPriceScale: {
                mode: PriceScaleMode.Normal,
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
            },
        });

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({width: chartContainerRef.current.clientWidth});
            }
        };

        seriesRef.current = chartRef.current.addLineSeries();

        const newTrades = trades.filter(
            (trade) => !previousTradesRef.current.some((prevTrade) => prevTrade.id === trade.id)
        );

        if (previousTradesRef.current.length === 0) {
            seriesRef.current.setData(transformTradesToLineData(trades, currentSuiPrice));

            // @ts-ignore
            chartRef.current.timeScale().fitContent();
        } else if (newTrades.length > 0) {
            let data = transformTradesToLineData(newTrades, currentSuiPrice);
            data.forEach((trade) => {
                // @ts-ignore
                seriesRef.current.update({
                    time: trade.time,
                    value: trade.value,
                });
            });
            chartRef.current.timeScale().fitContent();
            previousTradesRef.current = trades;
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, [trades, currentSuiPrice]);

    return (
        <div
            ref={chartContainerRef}
        >
            {!trades && <div>Loading trades....</div>}
            {fetchTradesError && <div>Failed to load trades {fetchTradesError}</div>}

        </div>
    );
};

export default LegacyTradesChart