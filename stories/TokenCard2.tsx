import {Card} from "@/components/ui/card";
import Link from "next/link";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {memo} from "react";
import {CurrentSuiPriceContext} from "@/components/Contexts";
import {suiToUsdLocaleString} from "@/lib/utils";
import {useContextSelector} from "use-context-selector";

type TokenCard2Props = {
    bondingCurveId: string;
    name: string;
    symbol: string;
    iconUrl: string;
    suiReserve: number;
    creator: string;
    description: string;
    // currentSuiPrice: number;
}
const TokenCard2Component = ({
                                 bondingCurveId,
                                 name,
                                 symbol,
                                 iconUrl,
                                 suiReserve,
                                 creator,
                                 description,
                                 // currentSuiPrice
                             }: TokenCard2Props) => {
    const currentSuiPrice = useContextSelector(CurrentSuiPriceContext, v => v);

    return (
        <Link href={`/coin/${bondingCurveId}`}>
            <Card className="
            p-4
            max-w-[384pt]
            flex
            flex-col
            hover:bg-card-hover
            hover:border-card-hover-border
            transition-colors duration-150">
                <div className="flex space-x-4 items-center">
                    <img
                        src={iconUrl || ""}
                        alt="Coin Logo"
                        className="w-24 h-24"
                        width={60}
                        height={60}
                    />
                    <div className="flex h-36 flex-col flex-1">
                        <p className="line-clamp-1 ">{name}</p>
                        <p className="muted-sm">
                            Ticker: ${symbol}
                        </p>
                        <p className="text-green-400 text-sm">
                            Market Cap: {suiToUsdLocaleString(suiReserve, currentSuiPrice)}
                        </p>
                        <p className="text-sm flex items-centerhttps://rpc.ankr.com/sui_testnet space-x-1.5">
                            <span className="muted-sm line-clamp-1">Created by:</span>
                            <CreatorAddressChip address={creator} variant={"small"} showAvatar/>
                        </p>
                        <div className="h-18">
                            <p className="muted-xs line-clamp-3">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export const TokenCard2 = memo(TokenCard2Component)