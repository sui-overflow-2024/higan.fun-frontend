import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {Progress} from "@/components/ui/progress";

export function TokenCard() {
    return (
        <Card className="p-4">
            <div className="flex space-x-4 max-w-md items-center">
                <Image
                    src="/sui-overflow-2024.jpg" //TODO dynamic image from on-chain config
                    alt="Vercel Logo" //TODO dynamic alt text
                    className="w-32 h-32 flex border-amber-400 border-2"
                    width={100}
                    height={100}
                />
                <div className="flex-col space-y-2">
                    <div className="flex space-x-4 justify-between">
                        <div className="flex-col">
                            <p className="text-xl">Indiana Jones</p>
                            <p className="text-muted-foreground  text-sm">
                                $JONES
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
                            Indiana Jones is an American media franchise consisting of five films
                            and a prequel television series, along with games, comics, and tie-in
                            novels, that depicts the adventures of Dr. Henry Walton "Indiana"
                            Jones, Jr. (portrayed in all films by Harrison Ford), a fictional
                            professor of archaeology.
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    )
}