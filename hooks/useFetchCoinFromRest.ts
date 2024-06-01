'use client';
import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import {CoinFromRestAPI} from "@/lib/types";
import {useContext} from "react";
import {AppConfigContext} from "@/components/Contexts";

type UseFetchCoinFromRestArgs = {
    packageId: string,
    options?: UseQueryOptions<CoinFromRestAPI>
}

export function useFetchCoinFromRest({
                                         packageId,
                                         options
                                     }: UseFetchCoinFromRestArgs): UseQueryResult<CoinFromRestAPI, Error> {

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