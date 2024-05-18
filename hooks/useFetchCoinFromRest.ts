import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import {TokenFromRestAPI} from "@/lib/types";
import {useContext} from "react";
import {AppConfigContext} from "@/components/Contexts";


type CoinResponse = {
    data: TokenFromRestAPI;
};
type UseFetchCoinFromRestArgs = {
    packageId: string,
    options?: UseQueryOptions<TokenFromRestAPI>
}
export function useFetchCoinFromRest({
                            packageId,
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
        queryKey: [packageId],
        queryFn: async () => {
            const response = await appConfig.axios.get(`/coins/${packageId}`)
            return response.data
        },
    });
}