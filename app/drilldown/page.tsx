'use client';
import {TokenFromRestAPI} from "@/lib/types";
import {addressToBackgroundColor, generateTrades} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Dispatch, SetStateAction, useState} from "react";
import twitterLogo from '@/public/twitter.png';
import telegramLogo from '@/public/telegram.png';
import webLogo from '@/public/world-wide-web.png';
import Image from "next/image";
import {BuySellDialog} from "@/components/BuySellDialog";
import TradesTable from "@/components/TradesTable";
import {useQuery} from "@tanstack/react-query";
import {faker} from "@faker-js/faker";


type CoinMetadataProps = {
    token: TokenFromRestAPI;
};
type CoinDetailsProps = {
    token: TokenFromRestAPI;
};
type Holder = {
    address: string;
    balance: number;
};

type TokenHoldersProps = {
    token: TokenFromRestAPI;
    holders: Holder[];
    totalSupply: number;
};


const CoinMetadata: React.FC<CoinMetadataProps> = ({token}) => {
    const {data: suiReserve} = {data: 100000}
    const {data: currentPrice} = {data: 1.03}

    // const { data: suiReserve } = useSuiClientQuery('getSuiReserve');
    // const { data: currentPrice } = useSuiClientQuery('getCurrentPrice');


    return (
        <div className="p-2 flex justify-between items-center rounded-lg">
            <div className="flex items-center space-x-4">
                <img
                    src={token.iconUrl || 'https://via.placeholder.com/40'}
                    alt={token.name}
                    className="w-10 h-10 rounded-full"
                />
                <h2 className="text-lg font-bold">{token.name} (${token.symbol})</h2>
            </div>
            <div className="flex items-center space-x-8">
                <span
                    className="text-green-400 text-sm">Market Cap: ${(suiReserve * currentPrice).toLocaleString()}</span>
                <span className="text-green-400 text-sm">Current Price: {currentPrice.toFixed(2)} SUI ($1)</span>
                <div className="flex items-center space-x-2 text-sm">
                    <span>Created by:</span>
                    <a
                        href={`/profile/${token.creator}`}
                        className="text-white px-1 py-1 rounded"
                        style={{backgroundColor: addressToBackgroundColor(token.creator)}}
                    >
                        {token.creator.slice(2, 8)}
                    </a>
                </div>
            </div>
        </div>
    );
};


const ActivePanelButtons: React.FC<{
    activePanel: string,
    setActivePanel: Dispatch<SetStateAction<"thread" | "trades">>
}> = ({activePanel, setActivePanel}) => {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex space-x-4">
                <Button
                    size={'sm'}
                    onClick={() => setActivePanel('thread')}
                    className={activePanel === 'thread' ? 'bg-blue-500' : ''}
                >
                    Thread
                </Button>
                <Button
                    size={'sm'}
                    onClick={() => setActivePanel('trades')}
                    className={activePanel === 'trades' ? 'bg-blue-500' : ''}
                >
                    Trades
                </Button>
            </div>
        </div>
    );
};

const SocialLinks: React.FC<{ token: TokenFromRestAPI }> = ({token}) => {
    return (
        <div className="flex space-x-4 items-center justify-center">
            <a href={token.twitterUrl} target="_blank" rel="noopener noreferrer">
                <Image src={twitterLogo} alt="Twitter" width={30} height={30}/>
            </a>
            <a href={token.telegramUrl} target="_blank" rel="noopener noreferrer">
                <Image src={telegramLogo} alt="Telegram" width={30} height={30}/>
            </a>
            <a href={token.website} target="_blank" rel="noopener noreferrer">
                <Image src={webLogo} alt="Website" width={30} height={30}/>
            </a>
        </div>
    );
};


// // Stub useQuery hook for totalSupply
// const useTotalSupply = () => {
//     return useQuery('totalSupply', async () => {
//         // Simulate an API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
//         return 21000; // Example total supply
//     });
// };

const CoinDetails: React.FC<CoinDetailsProps> = ({ token }) => {
    const bondingCurveProgress = 2; // Example progress percentage
    const marketCap = 900000; // Example market cap
    const target = 900000; // Example target market cap
    const totalSupply = Math.floor(Math.random() * 1000000); // Example total supply

    return (
        <div className="p-4 rounded-lg">
            <div className="flex items-start space-x-4">
                <div className="border border-gray-700">
                    <img
                        src={token.iconUrl || 'https://via.placeholder.com/100'}
                        alt={token.name}
                        width={100}
                        height={100}
                    />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{token.name} ({token.symbol})</h2>
                    <p className="text-sm text-gray-400">{token.description}</p>
                </div>
            </div>
            <div className="mt-4">
                <div className="text-gray-400 mb-2 text-sm">Bonding curve progress: {bondingCurveProgress}%</div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${bondingCurveProgress}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between text-green-400 mt-4 text-sm">
                <div>Market Cap: ${marketCap.toLocaleString()}</div>
                <div>Target: ${target.toLocaleString()}</div>
            </div>
            <div className="text-gray-400 mt-2 text-sm">
                Total Supply: {totalSupply.toLocaleString()}
            </div>
        </div>
    );
};


const bondingCurveAddress = 'abcdef';

const TokenHolders: React.FC<TokenHoldersProps> = ({ token, holders, totalSupply }) => {
    // Sort holders by balance in descending order and take the top 20
    const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance).slice(0, 20);

    return (
        <div className="p-2 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Whales</h2>
            <ul className="list-decimal list-inside">
                {sortedHolders.map((holder, index) => (
                    <li key={holder.address} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span>{index + 1}. {holder.address.slice(2, 8)}</span>
                            {holder.address === token.creator && <span className="text-gray-400 text-sm">(dev)</span>}
                            {holder.address === bondingCurveAddress && <span className="text-gray-400 text-sm">🏛 (bonding curve)</span>}
                        </div>
                        <span>{((holder.balance / totalSupply) * 100).toFixed(1)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default function Drilldown() {
    const [activePanel, setActivePanel] = useState<"thread" | "trades">('trades');

// Generate initial data with faker

    const trades = generateTrades(15);
    const coinSymbol = 'TST';
    const network = 'devnet';

    const exampleToken = {
        "packageId": "0xa512bbe7d3f75b0b91310057bbbac67aa4f3e1eda49c345fd00c3cfa7fd47c5b",
        "module": "coin_example",
        "storeId": "0x8cb5bc618d9943730a9404ad11143b9588dcd2033033cb6ded0c1bf87c4ceab3",
        "creator": "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501",
        "decimals": 3,
        "name": "Test Coin",
        "symbol": "TST",
        "description": "This is a test coin",
        "iconUrl": "https://example.com/icon.png",
        "website": "http://example.com",
        "twitterUrl": "",
        "discordUrl": "",
        "telegramUrl": "",
        "whitepaperUrl": "",
        "coinType": `0xa512bbe7d3f75b0b91310057bbbac67aa4f3e1eda49c345fd00c3cfa7fd47c5b::coin_example::COIN_EXAMPLE`,
        "createdAt": new Date(),
        "updatedAt": new Date(),
    }

    const exampleHolders: Holder[] = [
        { address: 'abcdef', balance: 700000 }, // Example holder with bonding curve
        { address: faker.finance.ethereumAddress(), balance: 100000 }, // Example creator
        { address: faker.finance.ethereumAddress(), balance: 100000 },
        { address: exampleToken.creator, balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        { address: faker.finance.ethereumAddress(), balance: 50000 },
        // Add more holders as needed
    ];
    const totalSupply = exampleHolders.reduce((acc, holder) => acc + holder.balance, 0);

    return (
        // <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <div className="container mx-auto">

                <main className="grid grid-cols-3 gap-8 mt-4">
                    <section className="col-span-2 space-y-4">
                        <CoinMetadata token={exampleToken}/>
                        <div className="bg-gray-700 p-4 min-h-[300px] flex items-center justify-center">
                            <h2 className="text-lg">TradingView Placeholder</h2>
                        </div>

                        <div className="flex justify-between p-2">
                            <div className="flex space-x-4">
                                <ActivePanelButtons activePanel={activePanel} setActivePanel={setActivePanel}/>
                            </div>
                            <div className="flex space-x-4">
                                <SocialLinks token={exampleToken}/>
                            </div>
                        </div>
                        <div className="p-2">
                            <TradesTable trades={trades} coinSymbol={exampleToken.symbol} network={network}/>
                        </div>
                    </section>


                    <aside className="space-y-4">
                        <BuySellDialog/>
                            <CoinDetails token={exampleToken}/>
                        <TokenHolders token={exampleToken} holders={exampleHolders} totalSupply={totalSupply}/>
                    </aside>
                </main>
            </div>
        </div>
        // </main>
    );
}