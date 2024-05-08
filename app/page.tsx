'use client'
// Why are we still here?
import {TokenCard} from "@/components/TokenCard";
import {BuySellDialog} from "@/components/BuySellDialog";
import {generateFakeToken} from "@/lib/utils";

export default function Home() {
    return (
        <main className="bg-background flex min-h-screen flex-col items-center justify-between p-24">
            <TokenCard token={generateFakeToken()}/>
            <BuySellDialog/>
        </main>
    );
}
