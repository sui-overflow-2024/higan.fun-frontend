import React, {useContext, useEffect, useRef} from 'react';
import {getValueWithDecimals} from "@/lib/utils";
import {ColorType, createChart, IChartApi, ISeriesApi} from 'lightweight-charts';
import {TradeFromRestAPI} from '@/lib/types';
import useSWR from "swr";
import {CoinGetTradesKey, coinRestApi} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";


type TradesChartProps = {
    // trades: TradeFromRestAPI[],
    packageId: string;
    // coinSymbol: string;
    // network: string;
};

const transformTradesToLineData = (trades: TradeFromRestAPI[]) => {
    const aggregatedData = trades.reduce((acc, trade) => {
        let time = new Date(trade.createdAt).getTime() / 1000; // Convert to seconds
        let price = parseFloat(getValueWithDecimals(trade.suiAmount / trade.coinAmount, 3));

        if (!acc[time]) {
            acc[time] = {time, priceSum: 0, count: 0};
        }

        acc[time].priceSum += price;
        acc[time].count += 1;

        return acc;
    }, {} as any);


    const data = Object.values(aggregatedData).map((entry: any) => ({
        time: entry.time,
        value: entry.priceSum / entry.count  // Calculate average price
    }));

    return data;
};

const chartStyle: any = {
    backgroundColor: '#1F2937',
    lineColor: '#2962FF',
    textColor: 'white',
    areaTopColor: '#2962FF',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)',
}
// Component for the trades list
const TradesChart: React.FC<TradesChartProps> = ({packageId}) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi>();
    const seriesRef = useRef<ISeriesApi<"Line">>();
    const previousTradesRef = useRef<TradeFromRestAPI[]>([]);
    const appConfig = useContext(AppConfigContext)

    const {data: trades, error: fetchTradesError} = useSWR<TradeFromRestAPI[], any, CoinGetTradesKey>({
        appConfig,
        packageId,
        path: "getTrades"
    }, coinRestApi.getTrades, {refreshInterval: 5000});


    useEffect(() => {
        if (!chartContainerRef.current) {
            return;
        }
        chartRef.current = createChart(chartContainerRef.current, {
            layout: {
                background: {type: ColorType.Solid, color: chartStyle.backgroundColor},
                textColor: chartStyle.textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
            },
        });


        chartRef.current.timeScale().fitContent();

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({width: chartContainerRef.current.clientWidth});
            }
        };

        seriesRef.current = chartRef.current.addLineSeries();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
        };
    }, []);


    useEffect(
        () => {

            if(!trades) return;
            if(!seriesRef?.current) return;
            const newTrades = trades.filter(
                (trade) => !previousTradesRef.current.some((prevTrade) => prevTrade.id === trade.id)
            );

            if (previousTradesRef.current.length === 0) {
                // @ts-ignore
                seriesRef.current.setData(transformTradesToLineData(trades));
            } else if (newTrades.length > 0) {
                let data = transformTradesToLineData(newTrades);
                data.forEach((trade) => {
                    // @ts-ignore
                    seriesRef.current.update({
                        time: trade.time,
                        value: trade.value,
                    });
                });
            }

            previousTradesRef.current = trades;
        },
        [trades]
    );
    if(!trades) return <div>Loading trades...</div>
    if(fetchTradesError) return <div>Failed to load trades {fetchTradesError}</div>
    const sortedTrades = trades.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());


    return (
        <div
            ref={chartContainerRef}
        >

        </div>
    );
};

export default TradesChart