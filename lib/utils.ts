import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {CoinFromRestAPI} from "@/lib/types";
import type {DevInspectResults} from "@mysten/sui.js/client";
import {bcs} from "@mysten/sui.js/bcs";

import {AppConfig} from "@/lib/config";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const toInitCap = (str: string[]): string => {
    return str.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
export const toSnakeCase = (str: string): string => {
    return str.replace(/\s+/g, '_').toLowerCase();
}
export const toSnakeCaseUpper = (str: string): string => {
    return toSnakeCase(str).toUpperCase()
}


export const getCoinTypePath = (token: CoinFromRestAPI): string => {
    return `${token.packageId}::${token.module}::${token.module.toUpperCase()}`
}

export const getCoinPathFunc = (token: CoinFromRestAPI, func: string): `${string}::${string}::${string}` => {
    return `${token.packageId}::${token.module}::${func}`
}

export const getManagerFuncPath = (appConfig: AppConfig, func: string): `${string}::${string}::${string}` => {
    return `${appConfig.managerContractPackageId}::${appConfig.managerContractModuleName}::${func}`
}

export const getValueWithDecimals = (value: number, decimals: number, fixed ?: number): string => {
    const divisor = Math.pow(10, decimals);

    // Divide the number by the divisor to get the floating point result
    const result = value / divisor;
    return fixed ? result.toFixed(fixed) : result.toString()
}

export const suiToUsdLocaleString = (suiReserve: number, currentSuiPrice: number): string => {
    const val = (suiReserve * Math.pow(10, -9)) * currentSuiPrice
    if (val < 0.01) {
        return "<$0.01"
    }
    return `$${val.toFixed(2)}`
}


export const extractPriceFromDevInspect = (res?: DevInspectResults) => {
    if (!res) return 0
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

export const addressToBackgroundColor = (address: string) => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `hsl(${hash % 360}, 50%, 50%)`;
};


export const largeNumberToFixedWithSymbol = (num: number, decimals: number = 2): string => {
    // Handle negative numbers
    const sign = num < 0 ? '-' : '';
    num = Math.abs(num);

    // Notice the "$" embedded in the template string below
    if (num >= 1_000_000_000_000) {
        return `${sign}$${(num / 1_000_000_000_000).toFixed(decimals)}T`;
    } else if (num >= 1_000_000_000) {
        return `${sign}$${(num / 1_000_000_000).toFixed(decimals)}B`;
    } else if (num >= 1_000_000) {
        return `${sign}$${(num / 1_000_000).toFixed(decimals)}M`;
    } else if (num >= 1_000) {
        return `${sign}$${(num / 1_000).toFixed(decimals)}k`;
    } else {
        return `${sign}$${num.toFixed(decimals)}`;
    }
}


export async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

export function truncateDecimals(num: number, decimals: number): number {
    return num * Math.pow(10, -1 * decimals);
}