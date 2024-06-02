import {Post} from "@/lib/prisma/client";
import {CoinFromRestAPI, HoldersFromRestAPI, PostFromRestAPI, TopCoinFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {Fetcher} from "swr";
import {CreateCoinFormData} from "@/components/CreateCoinForm";
import axios from "axios";
import {AppConfig} from "@/lib/config";

export type ThreadPostRequest = {
    coinId: string,
    text: string,
    signature: string,
    author: string,
}
export type CoinGetAllKey = { appConfig: AppConfig, packageIds?: string[], creator?: string, path: "getAll" }
export type CoinGetPostsKey = { appConfig: AppConfig, bondingCurveId: string, path: "getPosts" }
export type CoinGetTopKey = { appConfig: AppConfig, path: "getTop" }
export type CoinGetTradesKey = { appConfig: AppConfig, bondingCurveId: string, path: "getTrades" }
export type CoinGetHoldersByKey = { appConfig: AppConfig, bondingCurveId: string, path: "getHolders" }
export type CoinGetByIdKey = { appConfig: AppConfig, bondingCurveId: string, path: "getById" }
export type CoinSearchKey = { appConfig: AppConfig, term: string, sort: string, order: string }
export type CoinGetTvlKey = { appConfig: AppConfig, bondingCurveId: string, path: "getTvl24h" }

//TODO, prisma lets you do custom fields, let's clean this up and build it into get /:id later
export type GetTvlResponse = { bondingCurveId: string, tvl: number }
type CoinRestApi = {
    getAll: Fetcher<CoinFromRestAPI[], CoinGetAllKey>,
    search: Fetcher<CoinFromRestAPI[], CoinSearchKey>,
    getTop: Fetcher<TopCoinFromRestAPI, CoinGetTopKey>,
    getById: Fetcher<CoinFromRestAPI, CoinGetByIdKey>,
    getTrades: Fetcher<TradeFromRestAPI[], CoinGetTradesKey>,
    getHolders: Fetcher<HoldersFromRestAPI[], CoinGetHoldersByKey>,
    postCoin: Fetcher<CoinFromRestAPI, { appConfig: AppConfig, token: CreateCoinFormData }>
    postThread: Fetcher<Post, { appConfig: AppConfig, post: ThreadPostRequest }>
    getPosts: Fetcher<PostFromRestAPI[], CoinGetPostsKey>,
    getTvl24h: Fetcher<GetTvlResponse, CoinGetTvlKey>,
    getSuiPrice: Fetcher<number, string>,
}

export const coinRestApi: CoinRestApi = {
    getAll: async ({appConfig, packageIds, creator}) => {
        const params: { packageIds?: string[], creator?: string } = {};
        //Package IDs makes sense here, uniquely, because it's what we get from Sui's getCoinBalances RPC call
        if (packageIds && packageIds.length > 0) {
            params['packageIds'] = packageIds;
        }

        if (creator) {
            params['creator'] = creator;
        }
        const res = await appConfig.axios.get<CoinFromRestAPI[]>('/coins', {params});
        console.log("Retrieved the following coin from the REST API", res.data);
        return res.data;
    },
    search: async ({appConfig, term, sort, order}): Promise<CoinFromRestAPI[]> => {
        const res = await appConfig.axios.get<CoinFromRestAPI[]>(`/coins/search?term=${term}&order=${order}&sort=${sort}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getTop: async ({appConfig}): Promise<TopCoinFromRestAPI> => {
        const res = await appConfig.axios.get<TopCoinFromRestAPI>(`/coins/top`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getById: async ({appConfig, bondingCurveId}) => {
        const res = await appConfig.axios.get<CoinFromRestAPI>(`/coins/${bondingCurveId}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getTrades: async ({appConfig, bondingCurveId}): Promise<TradeFromRestAPI[]> => {
        const res = await appConfig.axios.get<TradeFromRestAPI[]>(`/coins/${bondingCurveId}/trades`)
        console.log("Retrieved the following trades from the REST API", res.data)
        return res.data
    },
    getPosts: async ({appConfig, bondingCurveId}): Promise<PostFromRestAPI[]> => {
        console.log(`Getting posts for the following coin from the REST API /coin/${bondingCurveId}/posts`)
        const res = await appConfig.axios.get<PostFromRestAPI[]>(`/coins/${bondingCurveId}/posts`)
        console.log("Retrieved the following posts from the REST API", res.data)
        return res.data
    },
    getTvl24h: async ({appConfig, bondingCurveId}): Promise<GetTvlResponse> => {
        console.log(`Getting posts for the following coin from the REST API /coin/${bondingCurveId}/posts`)
        const res = await appConfig.axios.get(`/coins/${bondingCurveId}/tvl24h`)
        console.log("Retrieved the following posts from the REST API", res.data)
        return res.data
    },
    getHolders: async ({appConfig, bondingCurveId}): Promise<HoldersFromRestAPI[]> => {
        console.log(`Getting posts for the following coin from the REST API /coins/${bondingCurveId}/holders`)
        const res = await appConfig.axios.get<HoldersFromRestAPI[]>(`/coins/${bondingCurveId}/holders`)
        console.log("Retrieved the following posts from the REST API", res.data)
        return res.data
    },
    postCoin: async ({appConfig, token}) => {
        console.log("Posting the following coin to the REST API", token)
        const res = await appConfig.axios.post<CoinFromRestAPI>(`/coins`, token)
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
