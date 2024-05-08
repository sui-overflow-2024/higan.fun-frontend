'use client';
import Link from 'next/link';
import {ConnectButton, useCurrentAccount} from '@mysten/dapp-kit';

export default function Navbar() {
    const account = useCurrentAccount();
    const shortAddress = account && `${account.address.slice(0, 6)}...${account.address.slice(-6)}`;
    console.log(account)
    return (
        <nav className="bg-gray-900 border-b-2 border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            {/*<Image*/}
                            {/*    src="/sui-overflow-2024.jpg"*/}
                            {/*    alt="Vercel Logo"*/}
                            {/*    className="dark:invert"*/}
                            {/*    width={100}*/}
                            {/*    height={24}*/}
                            {/*    priority*/}
                            {/*/>*/}
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/"
                                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Home
                                </Link>
                            </div>
                        </div>
                        <div className={"bg-accent p-3 rounded-xl"}>
                            {shortAddress}
                        </div>
                        <ConnectButton/>
                    </div>
                </div>
            </div>
        </nav>
    );
}
