export type CoinFromRestAPI = {
    id: number,
    packageId: string,
    module: string,
    bondingCurveId: string,
    creator: string,
    decimals: number,
    name: string,
    symbol: string,
    description: string,
    iconUrl: string,
    websiteUrl: string,
    twitterUrl: string,
    discordUrl: string,
    telegramUrl: string,
    whitepaperUrl: string,
    suiReserve: number,
    target: number,
    status: number,
    poolId: string,
    createdAt: Date,
    updatedAt: Date
}

export type TopCoinFromRestAPI = {
    newest: CoinFromRestAPI,
    hottest: CoinFromRestAPI,
    imminent: CoinFromRestAPI
}

export type TradeFromRestAPI = {
    id: number,
    isBuy: boolean,
    suiAmount: number,
    coinAmount: number,
    coinPrice: number,
    account: string,
    createdAt: Date,
    transactionId: string
}

export type PostFromRestAPI = {
    id: number,
    coinId: string,
    authorId: string,
    text: string,
    createdAt: Date,
}

export enum CoinStatus {
    OPEN = 0,
    CLOSE_IN_PROGRESS = 1,
    CLOSED = 2
}

export type HoldersFromRestAPI = {
    address: string,
    balance: number,
}
