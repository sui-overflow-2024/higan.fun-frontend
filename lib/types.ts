export type Token = {
    objectId: string,
    name: string,
    symbol: string,
    iconUrl: string,
    description: string,
}
export type NewTokenRequest = {
    name: string,
    symbol: string,
    iconUrl: string,
    description: string,
    creator: string,
    signature: string, //later
    decimals: number,
    website: string,
    twitterUrl: string,
    discordUrl: string,
    telegramUrl: string,
}
export type TokenWithAdditionalMetadata = Token & {
    creator: string,
    decimals: number,
    website: string,
    twitterUrl: string,
    discordUrl: string,
    telegramUrl: string,
}