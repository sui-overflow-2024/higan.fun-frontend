import Image from 'next/image';
import {TokenFromRestAPI} from "@/lib/types";
import {Progress} from "@/components/ui/progress";
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {addressToBackgroundColor, getRandomNumber, largeNumberToFixedWithSymbol} from "@/lib/utils";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";

export const TokenCard = ({ token }: {token: TokenFromRestAPI}) => {
    const fakeMarketCap = getRandomNumber(4_000, 100_000)
    return (
        <Link href={`/token/${token.coinType}`}>
        <Card className="p-4  flex flex-col">
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
                        Market Cap: {largeNumberToFixedWithSymbol(fakeMarketCap)}
                    </p>

                    <p className="text-sm flex items-center space-x-1.5">
                        <span className="muted-sm">Created by:</span>
                        <CreatorAddressChip address={token.creator} variant={"small"} showAvatar/>
                    </p>
                        <p className="muted-sm">

                    </p>
                        {/*<div className="text-center ml-auto">*/}
                        {/*    <p className="text-sm text-green-400">Market Cap</p>*/}
                        {/*    <p className="text-md text-green-400">$1,000,000,000</p>*/}
                        {/*</div>*/}
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
