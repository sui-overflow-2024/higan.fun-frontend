'use client';
import {Inter} from "next/font/google";
import '@mysten/dapp-kit/dist/index.css';
import Navbar from "@/components/Navbar";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StrictMode, useEffect, useState} from "react";
import {SuiClientProvider, WalletProvider} from '@mysten/dapp-kit';
import {getFullnodeUrl} from '@mysten/sui.js/client';
import {PrismaClient} from "@/lib/prisma/client";
import {AppConfigContext, CurrentSuiPriceProvider, ThemeProvider} from "@/components/Contexts";
import {Toaster} from "@/components/ui/toaster";
import "./globals.css";
import {defaultAppConfig} from "@/lib/config";


const inter = Inter({subsets: ["latin"]});

const queryClient = new QueryClient();
const networks = {
    // localnet: {url: getFullnodeUrl('localnet')},
    // devnet: {url: getFullnodeUrl('devnet')},
    testnet: {url: getFullnodeUrl('testnet')},
    // mainnet: {url: getFullnodeUrl('mainnet')},
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isClient, setIsClient] = useState(false)
    useEffect(() => {
        setIsClient(true)
    }, [])

    const prismaClient = new PrismaClient({
        datasourceUrl: "../we-hate-the-ui-backend/prisma/dev.db"
    })

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
                        <CurrentSuiPriceProvider>
                            <QueryClientProvider client={queryClient}>
                                <SuiClientProvider networks={networks} defaultNetwork="testnet">
                                    <WalletProvider>
                                        <Navbar/>
                                        {children}
                                    </WalletProvider>
                                </SuiClientProvider>
                            </QueryClientProvider>
                            <Toaster/>
                        </CurrentSuiPriceProvider>
                    </AppConfigContext.Provider> : "How dis happen? Refresh the page to force loading as client."}
            </ThemeProvider>
        </StrictMode>
        </body>
        </html>
    );
}
