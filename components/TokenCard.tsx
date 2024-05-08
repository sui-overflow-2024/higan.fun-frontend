'use client'
import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {Progress} from "@/components/ui/progress";
import {Token} from "@/lib/types";
import {FC} from "react";

export const TokenCard: FC<{token: Token}> = ({token}) => {
    return (
        <Card className="p-4">
            <div className="flex space-x-4 max-w-md items-center">
                <Image
                    src={token.iconUrl} //TODO dynamic image from on-chain config
                    alt="Coin Logo" //TODO dynamic alt text
                    className="w-32 h-32 flex"
                    width={100}
                    height={100}
                />
                <div className="flex-col space-y-2">
                    <div className="flex space-x-4 justify-between">
                        <div className="flex-col">
                            <p className="text-lg">{token.name}</p>
                            <p className="text-muted-foreground  text-sm">
                                ${token.symbol}
                            </p>
                        </div>
                        <div className="flex-col text-center ml-auto">
                            <p className="text-sm text-green-400">Market Cap</p>
                            <p className="text-md text-green-400">$1,000,000,000</p>
                        </div>
                    </div>
                    <Progress value={66} />
                    <div className="h-18 overflow-hidden">
                        <p className="text-muted-foreground text-xs line-clamp-3">
                            {token.description}
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}