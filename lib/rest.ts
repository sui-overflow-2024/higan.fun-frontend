import {AppConfig} from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";
import {Prisma} from "@/lib/prisma/client";

export const coinRestApi = {
    getAll: async (appConfig: AppConfig, objectId: string): Promise<TokenFromRestAPI[]> => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getById: async (appConfig: AppConfig, objectId: string): Promise<TokenFromRestAPI> => {
        const res = await appConfig.axios.get<TokenFromRestAPI>(`/coins/${objectId}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    post: async (appConfig: AppConfig, token: Prisma.CoinCreateInput): Promise<TokenFromRestAPI> => {
        const res = await appConfig.axios.post<TokenFromRestAPI>(`/coins`, token)
        console.log("Posted the following coin to the REST API", res.data)
        return res.data
    }
}