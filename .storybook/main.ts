import type {StorybookConfig} from "@storybook/nextjs";
import path from "node:path";


const config: StorybookConfig = {
    stories: [
        "../stories/**/*.mdx",
        "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-onboarding",
        "@chromatic-com/storybook",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-a11y",
        "@storybook/addon-storysource",
    ],
    framework: "@storybook/nextjs",
    staticDirs: ["../public"],
    webpackFinal: async (config) => {
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                '@': path.resolve(__dirname, '../src'),
            };
        }
        return config;
    },
};


export default config;
