import {CoinFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {faker} from "@faker-js/faker";
import {toInitCap, toSnakeCase} from "@/lib/utils";
import {TokenMetric} from "@/lib/sui";

export function generateRandomHex(bytes: number): string {
    const buffer = new Uint8Array(bytes);
    // Populate the buffer with random values
    crypto.getRandomValues(buffer);
    // Convert the buffer to a hexadecimal string
    return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const generateFakeToken = (): CoinFromRestAPI => {
    // Capitalize the first letter of each word
    const logos = ["./dai.svg", "./usdc.svg", "./usdt.svg", "./sui-sea.svg",];
    const randLogo = logos[Math.floor(Math.random() * logos.length)];

    // const packageId = generateRandomHex(16);
    const packageId = "0xa512bbe7d3f75b0b91310057bbbac67aa4f3e1eda49c345fd00c3cfa7fd47c5b";
    const name = faker.lorem.words({min: 2, max: 5}).split(' ')
    return {
        id: 0,
        poolId: "",
        status: getRandomNumber(0, 3),
        target: 5_000_000_000,
        creator: "0xb2720b42e26a7fc1eb555ecd154ef3dc2446f80c1f186af901cd38b842e52044",
        decimals: 3,
        discordUrl: "https://docs.sui.io/sui-api-ref#suix_resolvenameservicenames",
        module: toSnakeCase(name.join(' ')),
        bondingCurveId: "0x8cb5bc618d9943730a9404ad11143b9588dcd2033033cb6ded0c1bf87c4ceab3",
        telegramUrl: "https://sui.io/community-events-hub",
        twitterUrl: "https://x.com/dog_rates",
        websiteUrl: "https://github.com/ad0ll/we-hate-the-ui",
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


export const generateFakeTokenMetric = (): TokenMetric => ({
    tokenPrice: getRandomNumber(1999, 838383),
    suiBalance: getRandomNumber(500, 1000),
    totalSupply: getRandomNumber(1000, 10000)
})