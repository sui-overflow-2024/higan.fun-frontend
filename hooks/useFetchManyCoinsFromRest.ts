import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import {TokenFromRestAPI} from "@/lib/types";
import {useContext} from "react";
import {AppConfigContext} from "@/components/Contexts";


type UseFetchCoinFromRestArgs = {
    packageIds?: string[],
    options?: UseQueryOptions<TokenFromRestAPI>
}
export function useFetchCoinFromRest({
                                         packageIds,
                                         options
                                     }: UseFetchCoinFromRestArgs): UseQueryResult<TokenFromRestAPI, Error> {
    // const [method, params, { queryKey = [], ...options } = {}] = args as [
    //     method: T,
    //     params?: SuiRpcMethods[T]['params'],
    //     options?: UseSuiClientQueryOptions<T, TData>,
    // ];
    //
    // const suiContext = useSuiClientContext();
    const appConfig = useContext(AppConfigContext);
    return useQuery({
        ...options,
        queryKey: [packageIds],
        queryFn: async () => {
            const response = await appConfig.axios.get(`/coins?packageIds=${(packageIds || []).join(",")}`)
            return response.data
        },
    });
}