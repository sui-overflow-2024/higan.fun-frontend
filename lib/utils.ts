import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {CoinFromRestAPI} from "@/lib/types";
import type {DevInspectResults} from "@mysten/sui/client";
import {bcs} from "@mysten/sui/bcs";
import {SuiClientProviderContext} from "@mysten/dapp-kit";
import {Dex} from "kriya-dex-sdk";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const toInitCap = (str: string[]): string => {
    return str.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
export const toSnakeCase = (str: string): string => {
    return str.replace(/\s+/g, '_').toLowerCase();
}


export const getCoinTypePath = (token: CoinFromRestAPI): string => {
    return `${token.packageId}::${token.module}::${token.module.toUpperCase()}`
}

export const suiCoinTypePath = "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI";

export const getCoinPathFunc = (token: CoinFromRestAPI, func: string): `${string}::${string}::${string}` => {
    return `${token.packageId}::${token.module}::${func}`
}

export const getManagerFuncPath = (managerContractPackageId: string, managerContractModuleName: string, func: string): `${string}::${string}::${string}` => {
    return `${managerContractPackageId}::${managerContractModuleName}::${func}`
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

export function getLiquidityPoolType(
    kriyaPackageId: string,
    coinX: string | CoinFromRestAPI,
    coinY: string | CoinFromRestAPI,
): string {
    let coinXType = typeof coinX === "string" ? coinX : getCoinTypePath(coinX)
    let coinYType = typeof coinY === "string" ? coinY : getCoinTypePath(coinY)
    return `${kriyaPackageId}::spot_dex::Pool<${coinXType}, ${coinYType}>`
}

// 0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x2ea97875750567259075b4f1275632d48a5a83ae1ff3ce4e01555c7d34021142::aeger::AEGER, 0x2::sui::SUI>
// 0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::Pool<0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO, 0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI>
export async function getLiquidityPoolFields(
    suiClientCtx: SuiClientProviderContext,
    poolId: string,
    // coinX: string | CoinFromRestAPI,
    // coinY: string | CoinFromRestAPI,
) {
    const dex = new Dex(suiClientCtx.config?.url || "https://fullnode.mainnet.sui.io:443")
    // const poolId = getLiquidityPoolType(kyriaPackageId, coinX, coinY)
    console.log(`getLiquidityPoolId: `, poolId)
    const txn = await dex.suiClient.getObject({
        id: poolId,
        options: {showContent: true},
    });
    // @ts-ignore
    return txn.data?.content?.fields

}