import {TokenFromRestAPI} from "@/lib/types";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import Image from "next/image";
import {useContext} from "react";
import {CurrentSuiPriceContext} from "@/components/Contexts";
import {suiToUsdLocaleString} from "@/lib/utils";

export const TokenCard = ({token}: { token: TokenFromRestAPI }) => {
    const currentSuiPrice = useContext(CurrentSuiPriceContext)
    return (
        <Link href={`/coin/${token.packageId}`}>
            <Card className="p-4  flex flex-col hover:bg-card-hover hover:border-card-hover-border">
                <div className="flex space-x-4 items-center">
                    <Image
                        src={token.iconUrl}
                        alt="Coin Logo"
                        className="w-24 h-24"
                        width={60}
                        height={60}
                    />
                    <div className="flex h-36 flex-col flex-1">
                        <p className="line-clamp-1 ">{token.name}</p>
                        <p className="muted-sm">
                            Ticker: ${token.symbol}
                        </p>
                        <p className="text-green-400 text-sm">
                            Market Cap: ${suiToUsdLocaleString(token.suiReserve, currentSuiPrice)}
                        </p>
                        <p className="text-sm flex items-centerhttps://rpc.ankr.com/sui_testnet space-x-1.5">
                            <span className="muted-sm">Created by:</span>
                            <CreatorAddressChip address={token.creator} variant={"small"} showAvatar/>
                        </p>
                        <div className="h-18">
                            <p className="muted-xs line-clamp-3">
                                {token.description}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};
