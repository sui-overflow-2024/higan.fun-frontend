import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {TokenFromRestAPI} from "@/lib/types";
import type {DevInspectResults} from "@mysten/sui.js/client";
import {bcs} from "@mysten/sui.js/bcs";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


function generateRandomHex(bytes: number): string {
    const buffer = new Uint8Array(bytes);
    // Populate the buffer with random values
    crypto.getRandomValues(buffer);
    // Convert the buffer to a hexadecimal string
    return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
}

const toInitCap = (str: string[]): string => {
    return str.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

//
// export const generateFakeToken = (): TokenFromRestAPI => {
//     // Capitalize the first letter of each word
//
//     const logos = ["./dai.svg", "./usdc.svg", "./usdt.svg", "./sui-sea.svg",];
//     const randLogo = logos[Math.floor(Math.random() * logos.length)];
//
//     return {
//         objectId: generateRandomHex(16),
//         name: toInitCap(faker.lorem.words({min: 2, max: 5}).split(' ')),
//         symbol: faker.string.alpha({
//             casing: 'upper',
//             length: {min: 2, max: 5},
//             exclude: ["P"] //fuck this letter
//         }),
//         iconUrl: randLogo,
//         description: faker.lorem.sentence({min: 30, max: 120})
//     }
// }

export function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getCoinPath = (token: TokenFromRestAPI): string => {
    return `${token.packageId}::${token.module}::${token.module.toUpperCase()}`
}

export const getCoinPathFunc = (token: TokenFromRestAPI, func: string): `${string}::${string}::${string}` => {
    return `${token.packageId}::${token.module}::${func}`
}

export const getValueWithDecimals = (value: number, decimals: number, fixed ?: number): string => {
    const divisor = Math.pow(10, decimals);

    // Divide the number by the divisor to get the floating point result
    const result = value / divisor;
    return fixed ? result.toFixed(fixed) : result.toString()
}
export const extractPriceFromDevInspect = (res?: DevInspectResults ) => {
    if(!res) return 0
    const price = res.results?.[0]?.returnValues?.[0][0]
    return bcs.de("u64", new Uint8Array(price || [])) as number
}

export const stripCoinNameFromPath = (path: string): string => {
    // Path will be a::b::c, need to return a::b
    const parts = path.split('::');
    return parts.slice(0, parts.length - 1).join('::');
}
export const getFunctionPathFromCoinType = (coinType: string, func: string): string => {
    const funcPath = `${stripCoinNameFromPath(coinType)}::${func}`
    console.log("funcPath", funcPath)
    return funcPath
}
