import * as React from "react";
import {FC, useEffect, useRef, useState} from "react";
import {useContextSelector} from "use-context-selector";
import {CurrentSuiPriceContext} from "@/components/Contexts";
import {getValueWithDecimals, suiToUsdLocaleString} from "@/lib/utils";
import {CoinFromRestAPI} from "@/lib/types";
import {TokenMetric} from "@/lib/sui";
import {ProgressBar} from "@/stories/ProgressBar";
import {AnimatedNumber} from "@/stories/AnimatedNumber";


type CoinDetailsProps = {
    token: CoinFromRestAPI;
    tokenMetrics?: TokenMetric,
};

//TODO Move me into my own storybook later
const ClampedDescription = ({text}: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(true);
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
            } else {
                setIsOverflowing(false);
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


export const CoinDetails: FC<CoinDetailsProps> = ({token, tokenMetrics}) => {
    const currentSuiPrice = useContextSelector(CurrentSuiPriceContext, v => v);
    console.log("currentSuiPrice", currentSuiPrice)
    if (!tokenMetrics) return (<div>Loading...</div>)

    const target = token.target; // Example target market cap
    const totalSupply = tokenMetrics.totalSupply;
    const bondingCurveProgress = Math.min((tokenMetrics.suiBalance / target) * 100, 100);
    const targetUSD = getValueWithDecimals(target * currentSuiPrice, 9, 2);
    const totalSupplyWithDecimals = totalSupply * (Math.pow(10, -1 * token.decimals));
    let marketCap = suiToUsdLocaleString(tokenMetrics?.suiBalance || 0, currentSuiPrice);

    return (
        <div className="p-4 rounded-lg">
            <div className="flex items-start space-x-4">
                <div className="min-w-24 min-h-24 align-middle">
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
                <div className="text-gray-400 mb-2 text-sm">

                    Bonding curve progress: <AnimatedNumber value={bondingCurveProgress}
                                                            intlProps={{style: "percent"}}
                                                            fixedDigits={2}/>
                </div>
                <ProgressBar progress={bondingCurveProgress}/>
            </div>
            <div className="flex justify-between text-green-400 mt-4 text-sm">
                <div>Market Cap: {marketCap.toLocaleString()}</div>
                <div>Target: ${targetUSD}</div>
            </div>
            <div className="text-gray-400 mt-2 text-sm">
                Total Supply: <AnimatedNumber
                value={totalSupplyWithDecimals}
                fixedDigits={0}
            /> {token.symbol}
            </div>
        </div>
    );
};