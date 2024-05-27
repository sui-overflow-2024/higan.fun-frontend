export type TokenFromRestAPI = {
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
    // tradingVolume: number,
    createdAt: Date,
    updatedAt: Date
}

export type TopTokenFromRestAPI = {
    newest: TokenFromRestAPI,
    hottest: TokenFromRestAPI,
    imminent: TokenFromRestAPI
}

export type TradeFromRestAPI = {
    id: number,
    isBuy: boolean,
    suiAmount: number,
    coinAmount: number,
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

export type CoinPost = {
    id: bigint,
    coinId: string,
    author: string,
    text: string,
    likes: number,
    createdAt: Date,
}

export type TokenFromChain = TokenFromRestAPI

//
// export type TokenWithAdditionalMetadata = Token & {
//     creator: string,
//     decimals: number,
//     website: string,
//     twitterUrl: string,
//     discordUrl: string,
//     telegramUrl: string,
// }


