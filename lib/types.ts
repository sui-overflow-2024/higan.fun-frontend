export type CoinFromRestAPI = {
    packageId: string,
    module: string,
    storeId: string,
    creator: string,
    decimals: number,
    name: string,
    symbol: string,
    description: string,
    iconUrl: string,
    // signature: string, //later
    website: string,
    twitterUrl: string,
    discordUrl: string,
    telegramUrl: string,
    whitepaperUrl: string,
    coinType: string,
    suiReserve: number,
    target: number,
    status: number,
    // tradingVolume: number,
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
    STARTING_UP = 0,
    OPEN = 1,
    CLOSE_IN_PROGRESS = 2,
    CLOSED = 3
}

export type HoldersFromRestAPI = {
    address: string,
    balance: number,
}
