import {createContext, FC, PropsWithChildren} from "react";
import {PrismaClient} from "@/lib/prisma/client";
import axios, {Axios} from "axios";
import useSWR from "swr";
import {coinRestApi} from "@/lib/rest";

export type AppConfig = {
    restApiUrl: string,
    axios: Axios
}
export const PrismaClientContext = createContext<PrismaClient>(new PrismaClient(
    {
        datasourceUrl: "../we-hate-the-ui-backend/prisma/dev.db"
    }
));

export const defaultAppConfig = {
    restApiUrl: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    axios: axios.create({
        baseURL: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    }),
}

export const CurrentSuiPriceContext = createContext<number>(0)
export const CurrentSuiPriceProvider: FC<PropsWithChildren> = ({children}) => {

    const {
        data: currentSuiPrice,
        error: fetchCurrentSuiPriceError
    } = useSWR("getSuiPrice", coinRestApi.getSuiPrice, {refreshInterval: 5000})
    console.log(currentSuiPrice)
    return (<CurrentSuiPriceContext.Provider value={currentSuiPrice || 0}>
        {children}
    </CurrentSuiPriceContext.Provider>)
}

// console.log(defaultAppConfig)
// TODO Below should be a URL from env
export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);