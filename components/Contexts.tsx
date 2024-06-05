import * as React from "react";
import {FC, PropsWithChildren} from "react";
import {createContext, useContextSelector} from "use-context-selector";
import useSWR from "swr";
import {coinRestApi} from "@/lib/rest";
import {AppConfig, defaultAppConfig} from "@/lib/config";
import type {ThemeProviderProps} from "next-themes/dist/types";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export const AppConfigContext = createContext<AppConfig>(defaultAppConfig);


// Context that periodically fetches the current Sui price and loads it into context
// Several components of the app use this context to display prices in USD
export const CurrentSuiPriceContext = createContext<number>(0)
export const CurrentSuiPriceProvider: FC<PropsWithChildren> = ({children}) => {
    const longInterval = useContextSelector(AppConfigContext, (v) => v.longInterval)
    const {
        data: currentSuiPrice,
        error: fetchCurrentSuiPriceError
    } = useSWR("getSuiPrice", coinRestApi.getSuiPrice, {refreshInterval: longInterval})

    return (<CurrentSuiPriceContext.Provider value={currentSuiPrice || 0}>
        {children}
    </CurrentSuiPriceContext.Provider>)
}

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}