'use client';
import {Inter} from "next/font/google";
import '@mysten/dapp-kit/dist/index.css';
import Navbar from "@/components/Navbar";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StrictMode, useEffect, useState} from "react";
import {createNetworkConfig, SuiClientProvider, WalletProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui/client';
import {AppConfigContext, CurrentSuiPriceProvider, ThemeProvider} from "@/components/Contexts";
import {Toaster} from "@/components/ui/toaster";
import {defaultAppConfig} from "@/lib/config";
import "./globals.css";


const inter = Inter({subsets: ["latin"]});

const queryClient = new QueryClient();
const {networkConfig} = createNetworkConfig({
    // localnet: {url: getFullnodeUrl('localnet')},
    // devnet: {url: getFullnodeUrl('devnet')},
    testnet: {url: getFullnodeUrl('testnet')},
    // mainnet: {url: getFullnodeUrl('mainnet')},
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <html lang="en">
        <body className={inter.className}>

        <StrictMode>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >

                {isClient ?
                    <AppConfigContext.Provider value={defaultAppConfig}>
                        <QueryClientProvider client={queryClient}>
                            <CurrentSuiPriceProvider>
                                <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                                    <WalletProvider autoConnect={true}>
                                        <Navbar/>
                                        {children}
                                    </WalletProvider>
                                </SuiClientProvider>
                                <Toaster/>
                            </CurrentSuiPriceProvider>
                        </QueryClientProvider>
                    </AppConfigContext.Provider> : <></>}
            </ThemeProvider>
        </StrictMode>
        </body>
        </html>
    );
}
