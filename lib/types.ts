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
    createdAt: Date,
    updatedAt: Date
}

export type TopTokenFromRestAPI = {
    newest: TokenFromRestAPI,
    hottest: TokenFromRestAPI,
    imminent: TokenFromRestAPI
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