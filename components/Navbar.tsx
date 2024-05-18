'use client';
import Link from 'next/link';
import {ConnectButton, useCurrentAccount, useSuiClientContext} from '@mysten/dapp-kit';

function NetworkSelector() {
    const ctx = useSuiClientContext();

    return (
        <div>
            {Object.keys(ctx.networks).map((network) => (
                <button key={network} onClick={() => ctx.selectNetwork(network)}>
                    {`select ${network}`}
                </button>
            ))}
        </div>
    );
}


export default function Navbar() {
    const account = useCurrentAccount();
    const shortAddress = account && `${account.address.slice(0, 6)}...${account.address.slice(-6)}`;

    return (
        <nav className="bg-gray-900 border-b-2 border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Link href="/" className={"navbar-link"}>Home</Link>
                        <Link href={"/debug"} className={"navbar-link"}>
                            debug
                        </Link>
                        <Link href={"/createCoin"} className={"navbar-link"}>
                            createCoin
                        </Link>
                        <Link href={"/profile"} className={"navbar-link"}>
                            {shortAddress}
                        </Link>
                        <ConnectButton/>
                    </div>
                </div>
            </div>
        </nav>
    );
}
