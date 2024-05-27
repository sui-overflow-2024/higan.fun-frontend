import {AppConfig} from "@/components/Contexts";
import {Post} from "@/lib/prisma/client";
import {PostFromRestAPI, TokenFromRestAPI, TopTokenFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {Fetcher} from "swr";
import {CreateCoinFormData} from "@/components/CreateCoinForm";
import axios from "axios";

export type ThreadPostRequest = {
    coinId: string,
    text: string,
    signature: string,
    author: string,
}
export type CoinGetPostsKey = { appConfig: AppConfig, packageId: string, path: "getPosts" }
export type CoinGetTopKey = { appConfig: AppConfig, path: "getTop" }
export type CoinGetTradesKey = { appConfig: AppConfig, packageId: string, path: "getTrades" }
export type CoinGetByIdKey = { appConfig: AppConfig, packageId: string, path: "getById" }
export type CoinSearchKey = { appConfig: AppConfig, term: string, sort: string, order: string }
type CoinRestApi = {
    getAll: Fetcher<TokenFromRestAPI[], {
        appConfig: AppConfig,
        packageIds: string[],
        limit: number,
        order: string,
        sort: string
    }>,
    search: Fetcher<TokenFromRestAPI[], CoinSearchKey>,
    getTop: Fetcher<TopTokenFromRestAPI, CoinGetTopKey>,
    getById: Fetcher<TokenFromRestAPI, CoinGetByIdKey>,
    getTrades: Fetcher<TradeFromRestAPI[], CoinGetTradesKey>,
    postCoin: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, token: CreateCoinFormData }>
    postThread: Fetcher<Post, { appConfig: AppConfig, post: ThreadPostRequest }>
    getPosts: Fetcher<PostFromRestAPI[], CoinGetPostsKey>,
    getSuiPrice: Fetcher<number, string>,
}

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
    getPosts: async ({appConfig, packageId}): Promise<PostFromRestAPI[]> => {
        console.log(`Getting posts for the following coin from the REST API /coin/${packageId}/posts`)
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
    getSuiPrice: async () => {
        const res = await axios.get('https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744')
        const priceObj = res.data?.parsed?.[0]?.price;
        const {price, expo} = priceObj;
        return price * Math.pow(10, expo);
    }
}
