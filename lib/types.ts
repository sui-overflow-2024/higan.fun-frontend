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
    createdAt: Date,
    updatedAt: Date
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