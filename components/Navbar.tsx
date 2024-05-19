'use client';
import Link from 'next/link';
import {ConnectButton, useCurrentAccount, useSuiClientContext} from '@mysten/dapp-kit';
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

function NetworkSelector() {
    const ctx = useSuiClientContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"outline"} className={"min-w-24"}>
                    {ctx.network}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {Object.keys(ctx.networks).map((network) => (
                    <DropdownMenuItem
                        key={network}
                        onChange={(e) => ctx.selectNetwork(network)}
                    >
                        {network}
                    </DropdownMenuItem>

                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}


export default function Navbar() {
    const account = useCurrentAccount();
    const shortAddress = account && `${account.address.slice(0, 6)}...${account.address.slice(-6)}`;
    const adressString = `${account?.address.slice(0, 6)}...${account?.address.slice(-6)}`;
    return (
        <nav className="bg-gray-900 border-b-2 border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <div className={"border-r-2"}>
                            <Link href="/" className="navbar-link">Home</Link>
                        </div>
                        <div>
                            <Link href="/createCoin" className="navbar-link">Launch Token</Link>
                        </div>
                        <div>
                            {process.env.NODE_ENV === 'development' &&
                                <Link href="/debug" className="navbar-link">Debug</Link>}
                        </div>
                    </div>
                    <div className="ml-auto">
                        <ConnectButton/>
                        <NetworkSelector/>
                    </div>
                </div>
            </div>
        </nav>
    );
}
