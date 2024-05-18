'use client';
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useContext } from "react";
import { AppConfigContext } from "@/components/Contexts";
import {TokenFromRestAPI} from "@/lib/types";

// Define the arguments for the useFetchManyCoinsFromRest hook
type UseFetchCoinFromRestArgs = {
    packageIds?: string[],
    options?: UseQueryOptions<TokenFromRestAPI[], Error>
}

export function useFetchManyCoinsFromRest({
                                              packageIds,
                                              options
                                          }: UseFetchCoinFromRestArgs): UseQueryResult<TokenFromRestAPI[], Error> {
    const appConfig = useContext(AppConfigContext);

    // Fetch coins from the API
    const fetchCoins = async (): Promise<TokenFromRestAPI[]> => {
        try {
            const response = await appConfig.axios.get(`/coins`, {
                params: { packageIds: packageIds?.join(",") }
            });
            return response.data;
        } catch (error: any) {
            // Proper error handling
            throw new Error(error.response?.data?.message || 'Failed to fetch coins');
        }
    };

    // Use the useQuery hook to fetch data
    return useQuery<TokenFromRestAPI[], Error>({
        ...options,
        queryKey: ['coins', packageIds],
        queryFn: fetchCoins,
    });
}
