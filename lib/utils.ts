import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {TokenFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import type {DevInspectResults} from "@mysten/sui.js/client";
import {bcs} from "@mysten/sui.js/bcs";
import {faker} from "@faker-js/faker";

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
const toSnakeCase = (str: string): string => {
    return str.replace(/\s+/g, '_').toLowerCase();
}
const toSnakeCaseUpper = (str: string): string => {
    return toSnakeCase(str).toUpperCase()
}

//
export const generateFakeToken = (): TokenFromRestAPI => {
    // Capitalize the first letter of each word

    const logos = ["./dai.svg", "./usdc.svg", "./usdt.svg", "./sui-sea.svg",];
    const randLogo = logos[Math.floor(Math.random() * logos.length)];

    // const packageId = generateRandomHex(16);
    const packageId = "0xa512bbe7d3f75b0b91310057bbbac67aa4f3e1eda49c345fd00c3cfa7fd47c5b";
    const name = faker.lorem.words({min: 2, max: 5}).split(' ')
    const coinType = `${packageId}::${toSnakeCase(name.join(' '))}::${toSnakeCaseUpper(name.join(' '))}`
    return {
        target: 5_000_000_000,
        coinType,
        creator: "0xb2720b42e26a7fc1eb555ecd154ef3dc2446f80c1f186af901cd38b842e52044",
        decimals: 3,
        discordUrl: "https://docs.sui.io/sui-api-ref#suix_resolvenameservicenames",
        module: toSnakeCase(name.join(' ')),
        storeId: "0x8cb5bc618d9943730a9404ad11143b9588dcd2033033cb6ded0c1bf87c4ceab3",
        telegramUrl: "https://sui.io/community-events-hub",
        twitterUrl: "https://x.com/dog_rates",
        website: "https://github.com/ad0ll/we-hate-the-ui",
        whitepaperUrl: "https://githubnext.com/projects/copilot-workspace",
        packageId: generateRandomHex(16),
        name: toInitCap(faker.lorem.words({min: 2, max: 5}).split(' ')),
        symbol: faker.string.alpha({
            casing: 'upper',
            length: {min: 2, max: 5},
            exclude: ["P"] //fuck this letter
        }),
        iconUrl: randLogo,
        description: faker.lorem.sentence({min: 5, max: 60}),
        createdAt: new Date(),
        updatedAt: new Date(),
        suiReserve: getRandomNumber(500_000_000, 100_000_000_000) // 0.5 - 100 SUI

    }
}

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

export const generateTrades = (count: number): TradeFromRestAPI[] => {
    const activities = ['buy', 'sell'];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    return Array.from({length: count}, () => ({
        id: faker.number.int(),
        account: faker.finance.ethereumAddress(),
        activity: activity as "buy" | "sell",
        suiAmount: faker.number.float({min: 1, max: 80, fractionDigits: 2}),
        coinAmount: faker.number.float({min: 1, max: 80, fractionDigits: 2}),
        date: faker.date.recent().toLocaleDateString(),
        transactionId: faker.finance.ethereumAddress(),
        isBuy: activity === 'buy',
        createdAt: faker.date.recent(),
        coinPrice: faker.number.float({min: 1, max: 80, fractionDigits: 2}),
    }));
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