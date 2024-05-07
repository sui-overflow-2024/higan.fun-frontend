import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {Progress} from "@/components/ui/progress";

export function TokenCard() {
    return (
        <Card>
            <CardContent>
                <div className={"flex space-x-4 border-4"}>
                    <Image
                        src="/sui-overflow-2024.jpg"
                        alt="Vercel Logo"
                        className="dark:invert"
                        width={80}
                        height={80}
                        priority
                    />
                    <div className={"flex-col space-y-2"}>
                        <div className={"flex space-x-4"}>
                            <div className={"flex-col"}>
                                <p className={"text-xl"}>
                                    Indiana Jones
                                </p>
                                <p className={"text-muted-foreground text-muted-foreground text-sm"}>
                                    ticker: $JONES
                                </p>
                            </div>
                            <div className={"flex-col text-center"}>
                                <p className={"text-sm text-green-400"}>
                                    Market Cap
                                </p>
                                <p className={"text-md text-green-400"}>
                                    $1,000,000,000
                                </p>
                            </div>
                        </div>
                        <Progress value={66}/>
                        <p className={"text-muted-foreground"}>
                            Indiana Jones is an American media franchise consisting of five films and a prequel
                            television series, along with games, comics, and tie-in novels, that depicts the adventures
                            of Dr. Henry Walton "Indiana" Jones, Jr. (portrayed in all films by Harrison Ford), a
                            fictional professor of archaeology.
                        </p>
                    </div>
                </div>
            </CardContent>

        </Card>
    )
}