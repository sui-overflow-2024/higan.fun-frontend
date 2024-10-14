import * as React from "react";
import {FC} from "react";
import {CoinFromRestAPI} from "@/lib/types";
import {useSuiClientContext} from "@mysten/dapp-kit";
import {SocialIcon} from "@/stories/SocialIcon";
import webLogo from "@/public/web.svg";
import twitterLogo from "@/public/x.svg";
import telegramLogo from "@/public/telegram.svg";
import discordLogo from "@/public/discord.svg";
import suiLogo from "@/public/sui-sea.svg";

export const SocialLinks: FC<{ token: CoinFromRestAPI }> = ({token}) => {
    const ctx = useSuiClientContext();

    return (
        <div className="flex space-x-4 items-center justify-center">
            <SocialIcon link={token.websiteUrl} iconSrc={webLogo} alt={"Token Website"}/>
            <SocialIcon link={token.twitterUrl} iconSrc={twitterLogo} alt="X (Twitter)"/>
            <SocialIcon link={token.telegramUrl} iconSrc={telegramLogo} alt={"Telegram"}/>
            <SocialIcon link={token.discordUrl} iconSrc={discordLogo} alt={"discord"}/>
            <SocialIcon link={`https://suiscan.xyz/${ctx.network || "mainnet"}/object/${token.packageId}`}
                        iconSrc={suiLogo} alt={"SuiScan"}/>
        </div>
    );
};