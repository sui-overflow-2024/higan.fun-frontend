import axios, {Axios} from "axios";

export type AppConfig = {
    restApiUrl: string,
    axios: Axios,
    fallbackDevInspectAddress: string,
    managerContractPackageId: string,
    managerContractModuleName: string,
    managerContractConfigId: string,
}

export const defaultAppConfig: AppConfig = {
    restApiUrl: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    axios: axios.create({
        baseURL: process.env.NEXT_PUBLIC_REST_API_URL || "https://higan.fun/api",
    }),
    fallbackDevInspectAddress: process.env.NEXT_PUBLIC_DEV_INSPECT_FALLBACK_ADDRESS || "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501",
    managerContractPackageId: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_PACKAGE_ID || "",
    managerContractModuleName: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_MODULE_NAME || "manager_contract",
    managerContractConfigId: process.env.NEXT_PUBLIC_MANAGER_CONTRACT_CONFIG_ID || ""
}