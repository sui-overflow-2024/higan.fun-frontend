'use client';
import {useQuery, UseQueryOptions, UseQueryResult} from "@tanstack/react-query";
import {TokenFromRestAPI} from "@/lib/types";
import {useContext} from "react";
import {AppConfigContext} from "@/components/Contexts";

type UseFetchCoinFromRestArgs = {
    packageId: string,
    options?: UseQueryOptions<TokenFromRestAPI>
}

export function useFetchCoinFromRest({
                                         packageId,
                                         options
                                     }: UseFetchCoinFromRestArgs): UseQueryResult<TokenFromRestAPI, Error> {

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