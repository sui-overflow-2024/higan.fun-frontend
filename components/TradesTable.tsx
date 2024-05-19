import React from 'react';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';
import Link from "next/link";
import {formatDistanceToNow} from "date-fns";

export type Trade = {
    account: string;
    activity: 'buy' | 'sell';
    suiAmount: number;
    coinAmount: number;
    date: string;
    transactionId: string;
};

type TradesListProps = {
    trades: Trade[];
    coinSymbol: string;
    network: string;
};

// Function to generate deterministic background color based on address
const backgroundColor = (address: string) => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `hsl(${hash % 360}, 50%, 50%)`;
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
                        <Link href={`/profile/${trade.account}`} className="flex items-center space-x-2">
                            <Jazzicon diameter={24} seed={jsNumberForAddress(trade.account)}/>
                            <span
                                className="px-2 py-1 rounded font-mono"
                                style={{backgroundColor: backgroundColor(trade.account)}}
                            >
                                {trade.account.slice(2, 8)}
                            </span>
                        </Link>
                    </div>
                    <div className="w-1/6 text-sm text-center px-4">
                        <span className={trade.activity === 'buy' ? 'text-green-500' : 'text-red-500'}>
                            {trade.activity}
                        </span>
                    </div>
                    <div className="w-1/6 text-sm text-center px-4">{trade.suiAmount}</div>
                    <div className="w-1/6 text-sm text-center px-4">{trade.coinAmount}</div>
                    <div className="w-1/6 text-sm text-center px-4">
                        {formatDistanceToNow(new Date(trade.date), {addSuffix: true})}
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