'use client'
import * as React from "react";
import {Dispatch, SetStateAction} from "react";
import {CoinFromRestAPI} from "@/lib/types";
import Image from "next/image";

const CoinSelectDropdown: React.FC<{
    token: CoinFromRestAPI,
    setToken: Dispatch<SetStateAction<CoinFromRestAPI>>
}> = ({token}) => {
    /*TODO below should open coin selection dialog on click*/
    return (<div
        className="rounded-xl min-w-28 dropdown-button bg-gray-800 text-white
                    flex items-center justify-between px-2 py-2
                    cursor-pointer transition duration-150 ease-in-out hover:bg-gray-700">
        <div
            className="max-w-6 max-h-5 flex space-x-0.5 text-md"
        >

            <Image
                src={token.iconUrl || "../../public/sui-sea.svg"} //TODO dynamic image from on-chain config
                alt={token.symbol}
                width={100}
                height={100}
            />
            <span>{token.symbol}</span>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
    </div>)
}