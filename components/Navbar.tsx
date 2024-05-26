'use client';
import Link from 'next/link';
import {ConnectButton, useCurrentAccount, useSuiClientContext} from '@mysten/dapp-kit';
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {usePathname} from "next/navigation";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";

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
    const pathname = usePathname()
    return (
        <nav className="border-b-2 border-gray-800">
            <div className="container mx-auto">
                <div className="flex items-center h-16">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button
                                className={pathname === "/" ? "text-primary underline" : "text-white"}
                                variant={"link"}>
                                Home
                            </Button>
                        </Link>
                        <Link href="/create">

                            <Button
                                className={pathname === "/create" ? "text-primary underline" : "text-white"}
                                variant={"link"}>
                                Launch Token
                            </Button>
                        </Link>

                        {process.env.NODE_ENV === 'development' &&
                            <Link href="/debug">
                                <Button
                                    className={pathname === "/debug" ? "text-primary underline" : "text-white"}
                                    variant={"link"}>
                                    Debug
                                </Button>
                            </Link>}
                    </div>
                    <div className="ml-auto">
                        <div className="flex items-center gap-2">
                            <div>
                                {account &&
                                    <CreatorAddressChip address={account.address} variant={"large"} showAvatar/>
                                }
                            </div>
                            <ConnectButton
                                className={"bg-primary text-primary-foreground shadow hover:bg-primary/90"}
                                style={{padding: "0.5rem 1rem"}}
                            />
                            {/*<NetworkSelector/>*/}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
