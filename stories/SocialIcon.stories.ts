import type {Meta, StoryObj} from '@storybook/react';
import {SocialIcon} from "@/stories/SocialIcon";
import discordLogo from '@/public/discord.svg';
import telegramLogo from '@/public/telegram.svg';
import xLogo from "@/public/twitter.png"
import webLogo from '@/public/web.svg';
import suiLogo from '@/public/sui-sea.svg';
import {generateRandomHex} from "@/lib/generators";


const meta: Meta<typeof SocialIcon> = {
    title: "Generic/SocialIcon",
    component: SocialIcon
};

export default meta


type Story = StoryObj<typeof meta>;

export const Discord: Story = {
    args: {
        link: "https://discord.com/storybookjs",
        iconSrc: discordLogo,
        alt: "discord"
    }
};

export const X: Story = {
    args: {
        link: "https://x.com/storybookjs",
        iconSrc: xLogo,
        alt: "X (Twitter)",
    }
};

export const Telegram: Story = {
    args: {
        link: "https://t.me/storybookjs",
        iconSrc: telegramLogo,
        alt: "Telegram",
    }
};

export const Website: Story = {
    args: {
        iconSrc: webLogo,
        link: `https://cool.com`,
        alt: "Token Website"
    }
}

export const SuiScan: Story = {
    args: {
        link: `https://suiscan.xyz/mainnet3/object/${generateRandomHex(16)}`,
        iconSrc: suiLogo,
        alt: "SuiScan",
    }
}