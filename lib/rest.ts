import {AppConfig} from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";
import {Prisma} from "@/lib/prisma/client";
import {Fetcher} from "swr";

type CoinRestApi = {
    getAll: Fetcher<TokenFromRestAPI[], {
        appConfig: AppConfig,
        packageIds: string[],
        limit: number,
        sortOrder: "asc" | "desc"
    }>,
    getById: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, packageId: string }>,
    post: Fetcher<TokenFromRestAPI, { appConfig: AppConfig, token: Prisma.CoinCreateInput }>
}
export const coinRestApi: CoinRestApi = {
    getAll: async ({appConfig, packageIds, limit, sortOrder}) => {
        const res = await appConfig.axios.get<TokenFromRestAPI[]>(`/coins`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    getById: async ({appConfig, packageId}) => {
        const res = await appConfig.axios.get<TokenFromRestAPI>(`/coins/${packageId}`)
        console.log("Retrieved the following coin from the REST API", res.data)
        return res.data
    },
    post: async ({appConfig, token}) => {
        console.log("Posting the following coin to the REST API", token)
        console.log("appConfig.axios", appConfig.axios.defaults)
        const res = await appConfig.axios.post<TokenFromRestAPI>(`/coins`, token)
        console.log("Posted the following coin to the REST API", res.data)
        return res.data
    }
}
