import {createContext} from "react";
import {PrismaClient} from "@/lib/prisma/client";
import axios, {Axios} from "axios";

export type AppConfig ={
    restApiUrl: string,
    axios: Axios
}
export const PrismaClientContext = createContext<PrismaClient>(new PrismaClient(
    {
        datasourceUrl: "../we-hate-the-ui-backend/prisma/dev.db"
    }
));

export const defaultAppConfig = {
    restApiUrl: process.env.REST_API_URL || "http://localhost:3004",
    axios: axios.create({
        baseURL: process.env.REST_API_URL || "http://localhost:3004",
    }),
}
// console.log(defaultAppConfig)
// TODO Below should be a URL from env
export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);