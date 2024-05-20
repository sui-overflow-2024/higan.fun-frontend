import {AppConfig} from "@/components/Contexts";
import {TokenFromRestAPI, TopTokenFromRestAPI} from "@/lib/types";
import {Prisma} from "@/lib/prisma/client";

export const coinRestApi = {
    getAll: async (appConfig: AppConfig, sort: string, order: string): Promise<TokenFromRestAPI[]> => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    search: async (appConfig: AppConfig, term: string, sort: string, order: string): Promise<TokenFromRestAPI[]> => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins/search?term=${term}&order=${order}&sort=${sort}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getTop: async (appConfig: AppConfig): Promise<TopTokenFromRestAPI> => {
        const res = await appConfig.axios.get<TopTokenFromRestAPI>(`/top_coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getById: async (appConfig: AppConfig, objectId: string): Promise<TokenFromRestAPI> => {
        const res = await appConfig.axios.get<TokenFromRestAPI>(`/coins/${objectId}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    post: async (appConfig: AppConfig, token: Prisma.CoinCreateInput): Promise<TokenFromRestAPI> => {
        console.log("Posting the following coin to the REST API", token)
        console.log("appConfig.axios", appConfig.axios.defaults)
        const res = await appConfig.axios.post<TokenFromRestAPI>(`/coins`, token)
        console.log("Posted the following coin to the REST API", res.data)
        return res.data
    }
}