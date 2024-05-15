'use client'
// Why are we still here?
import {TokenCard} from "@/components/TokenCard";
import {BuySellDialog} from "@/components/BuySellDialog";
import {generateFakeToken} from "@/lib/utils";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import Filter from "@/components/ui/filter";

export default function Home() {
    return (
        <main className="bg-background flex min-h-[calc(100vh_-_66px)] flex-col items-center justify-between p-24">
            {/* <TokenCard token={generateFakeToken()}/>
            <BuySellDialog/> */}

<div className=" w-full flex items-start my-5">
        <Filter/>
      </div>
            <div className=" size-full">
            <ResponsiveMasonry
            
                columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
            >
                <Masonry gutter="1.5rem">
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
           
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
     
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                <TokenCard token={generateFakeToken()}/>
                </Masonry>
            </ResponsiveMasonry>
            </div>

        </main>
    );
}
