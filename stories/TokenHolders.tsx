import * as React from "react";
import {FC} from "react";
import {useContextSelector} from "use-context-selector";
import {AppConfigContext} from "@/components/Contexts";
import useSWR from "swr";
import {CoinFromRestAPI, HoldersFromRestAPI} from "@/lib/types";
import {CoinGetHoldersByKey, coinRestApi} from "@/lib/rest";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {AnimatedNumber} from "@/stories/AnimatedNumber";
import {TokenMetric} from "@/lib/sui";
import {AnimatePresence, motion} from "framer-motion";

type TokenHoldersProps = {
    token: CoinFromRestAPI;
    tokenMetrics: TokenMetric;
};


export const TokenHolders: FC<TokenHoldersProps> = ({token, tokenMetrics}) => {
    const axios = useContextSelector(AppConfigContext, (v) => v.axios);

    const totalSupply = tokenMetrics?.totalSupply || 0;
    const {data: holders, error: holdersError} = useSWR<HoldersFromRestAPI[], any, CoinGetHoldersByKey>(
        {axios, bondingCurveId: token.bondingCurveId, path: "getHolders"},
        coinRestApi.getHolders, {
            refreshInterval: 2500
        }
    );

    if (!tokenMetrics) return <div>Loading token metrics...</div>;
    if (holdersError) return <div>Error fetching holders</div>;
    if (!holders) return <div>Loading holders</div>;

    const sortedHolders = [...holders]
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 20);

    return (
        <div className="p-2 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Top Holders</h2>
            <AnimatePresence>
                <ol className="list-decimal list-inside">
                    {sortedHolders.map((holder, index) => (
                        <motion.li
                            key={holder.address}
                            initial={{opacity: 0, y: 50}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -50}}
                            transition={{duration: 0.3}}
                            className="flex justify-between items-center mb-2"
                            layout
                        >
                            <div className="flex space-x-2">
                                <span>{index + 1}.</span>
                                <CreatorAddressChip
                                    address={holder.address}
                                    isCreator={holder.address === token.creator}
                                    variant="small"
                                />
                            </div>
                            <AnimatedNumber
                                value={(holder.balance / totalSupply) * 100}
                                intlProps={{
                                    style: "percent"
                                }}
                                fixedDigits={2}
                            />
                        </motion.li>
                    ))}
                </ol>
            </AnimatePresence>
        </div>
    );
};