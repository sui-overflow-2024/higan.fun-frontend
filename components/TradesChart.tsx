import React, {useEffect, useRef} from 'react';
import {getValueWithDecimals} from "@/lib/utils";
import {ColorType, createChart, IChartApi, ISeriesApi} from 'lightweight-charts';
import {TradeFromRestAPI} from '@/lib/types';


type TradesChartProps = {
    trades: TradeFromRestAPI[],
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
const TradesChart: React.FC<TradesChartProps> = ({trades}) => {
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<IChartApi>();
    const seriesRef = useRef<ISeriesApi<"Line">>();
    const previousTradesRef = useRef<TradeFromRestAPI[]>([]);

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

    return (
        <div
            ref={chartContainerRef}
        >

        </div>
    );
};

export default TradesChart