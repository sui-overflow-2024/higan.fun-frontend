export type Token = {
    objectId: string,
    name: string,
    symbol: string,
    iconUrl: string,
    description: string,
}
export type TokenWithAdditionalMetadata = Token & {
    creator: string,
    decimals: number,
    website: string,
    twitterUrl: string,
    discordUrl: string,
    telegramUrl: string,
}