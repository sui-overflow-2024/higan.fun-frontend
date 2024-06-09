import axios, {Axios} from "axios";
import {CoinFromRestAPI, PostFromRestAPI, TradeFromRestAPI} from "@/lib/types";
import {io, Socket} from "socket.io-client";

export interface ServerToClientEvents {
    postCreated: (data: PostFromRestAPI) => void;
    coinCreated: (data: CoinFromRestAPI) => void;
    tradeCreated: (data: { trade: TradeFromRestAPI, coin: CoinFromRestAPI }) => void;
}


export type AppConfig = {
    restApiUrl: string,
    websocketUrl: string,
    axios: Axios,
    fallbackDevInspectAddress: string,
    managerContractPackageId: string,
    managerContractModuleName: string,
    managerContractConfigId: string,
    kriyaPackageId: string,
    socket: Socket<ServerToClientEvents, any>
    shortInterval: number
    mediumInterval: number
    longInterval: number
}

export const defaultAppConfig: AppConfig = {
    restApiUrl: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    websocketUrl: process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000",
    axios: axios.create({
        baseURL: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    }),
    fallbackDevInspectAddress: process.env.NEXT_PUBLIC_DEV_INSPECT_FALLBACK_ADDRESS || "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501",
    managerContractPackageId: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_PACKAGE_ID || "",
    managerContractModuleName: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_MODULE_NAME || "manager_contract",
    managerContractConfigId: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_CONFIG_ID || "",
    kriyaPackageId: process.env.NEXT_PUBLIC_KRIYA_CONTRACT_PACKAGE_ID || "0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd", //Default: Testnet
    socket: io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || process.env.NEXT_PUBLIC_REST_API_URL || "http://localhost:3000"),
    shortInterval: 5000,
    mediumInterval: 10000,
    longInterval: 30000
}


export const SUI_COIN_TYPE = `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`