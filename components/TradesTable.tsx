import React from 'react';
import {formatDistanceToNow} from "date-fns";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {getValueWithDecimals} from "@/lib/utils";
import {TradeFromRestAPI} from "@/lib/types";

type TradesListProps = {
    trades: TradeFromRestAPI[];
    coinSymbol: string;
    network: string;
};


// Component for the trades list
const TradesList: React.FC<TradesListProps> = ({trades, coinSymbol, network}) => {
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
            {trades.map((trade, index) => (
                <div key={index} className="flex items-center bg-gray-700 hover:bg-gray-600 p-2 my-1 rounded-lg">
                    <div className="flex-1 flex items-center justify-center space-x-2 px-4">
                        <CreatorAddressChip address={trade.account} showAvatar={true} variant={"small"}/>
                    </div>
                    <div className="w-1/6 text-sm text-center px-4">
                        <span className={trade.isBuy ? 'text-green-500' : 'text-red-500'}>
                            {trade.isBuy ? 'Buy' : 'Sell'}
                        </span>
                    </div>
                    <div className="w-1/6 text-sm text-center px-4">{getValueWithDecimals(trade.suiAmount, 9, 4)}</div>
                    <div className="w-1/6 text-sm text-center px-4">{getValueWithDecimals(trade.coinAmount, 3)}</div>
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
            ))}
        </div>
    );
};

export default TradesList