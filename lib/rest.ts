import {AppConfig} from "@/components/Contexts";
import {TokenFromRestAPI, TopTokenFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {Post, Prisma} from "@/lib/prisma/client";
import {Fetcher} from "swr";

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
    postCoin: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, token: Prisma.CoinCreateInput }>
    postThread: Fetcher<Post, { appConfig: AppConfig, post: ThreadPostRequest }>
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
    postCoin: async ({appConfig, token}) => {
        console.log("Posting the following coin to the REST API", token)
        console.log("appConfig.axios", appConfig.axios.defaults)
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
    }
}
