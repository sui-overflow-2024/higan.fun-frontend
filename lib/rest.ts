import {AppConfig} from "@/components/Contexts";
import {Post} from "@/lib/prisma/client";
import {PostFromRestAPI, TokenFromRestAPI, TopTokenFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {Fetcher} from "swr";
import {CreateCoinFormData} from "@/components/CreateCoinForm";

export type ThreadPostRequest = {
    coinId: string,
    text: string,
    signature: string,
    author: string,
}

type CoinRestApi = {
    getAll: Fetcher<TokenFromRestAPI[], {
        appConfig: AppConfig,
        packageIds: string[],
        limit: number,
        order: string,
        sort: string
    }>,
    search: Fetcher<TokenFromRestAPI[], { appConfig: AppConfig, term: string, sort: string, order: string }>,
    getTop: Fetcher<TopTokenFromRestAPI, { appConfig: AppConfig }>,
    getById: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, packageId: string }>,
    getTrades: Fetcher<TradeFromRestAPI[], { appConfig: AppConfig, packageId: string }>,
    postCoin: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, token: CreateCoinFormData }>
    postThread: Fetcher<Post, { appConfig: AppConfig, post: ThreadPostRequest }>
    getThreads: Fetcher<PostFromRestAPI[], { appConfig: AppConfig, packageId: string }>,
    getSuiPrice: Fetcher<number, { appConfig: AppConfig }>,
}

// model Post {
//     id       BigInt @id @default(autoincrement())
//     coinId   String
//     author String @default("")
//     text     String
//     // text     String @db.VarChar(1000)
//     likes    Int    @default(0)
//     // author   User   @relation(fields: [authorId], references: [id])
//     coin     Coin   @relation(fields: [coinId], references: [packageId])
//     createdAt DateTime @default(now())
// }


export const coinRestApi: CoinRestApi = {
    getAll: async ({appConfig, packageIds, limit, sort, order,}) => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    search: async ({appConfig, term, sort, order}): Promise<TokenFromRestAPI[]> => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins/search?term=${term}&order=${order}&sort=${sort}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getTop: async ({appConfig}): Promise<TopTokenFromRestAPI> => {
        const res = await appConfig.axios.get<TopTokenFromRestAPI>(`/top_coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getById: async ({appConfig, packageId}) => {
        const res = await appConfig.axios.get<TokenFromRestAPI>(`/coins/${packageId}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getTrades: async ({appConfig, packageId}): Promise<TradeFromRestAPI[]> => {
        const res = await appConfig.axios.get<TradeFromRestAPI[]>(`/coins/${packageId}/trades`)
        console.log("Retrieved the following trades from the REST API", res.data)
        return res.data
    },
    getThreads: async ({appConfig, packageId}): Promise<PostFromRestAPI[]> => {
        const res = await appConfig.axios.get<PostFromRestAPI[]>(`/coin/${packageId}/posts`)
        console.log("Retrieved the following posts from the REST API", res.data)
        return res.data
    },
    postCoin: async ({appConfig, token}) => {
        console.log("Posting the following coin to the REST API", token)
        const res = await appConfig.axios.post<TokenFromRestAPI>(`/coins`, token)
        console.log("Posted the following coin to the REST API", res.data)
        return res.data
    },
    postThread: async ({appConfig, post}) => {
        console.log("Posting the following post to the REST API", post)
        console.log("appConfig.axios", appConfig.axios.defaults)
        const res = await appConfig.axios.post<Post>(`/post`, post)
        console.log("Posted the following coin to the REST API", res.data)
        return res.data
    },
    getSuiPrice: async ({appConfig}) => {
        const res = await appConfig.axios.get('https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744')
        const priceObj = res.data?.parsed?.[0]?.price;
        const {price, expo} = priceObj;
        const priceNumber = price *  Math.pow(10, expo);

        return priceNumber;
    }
}
