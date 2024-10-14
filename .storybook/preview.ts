import '../app/globals.css'
import type {Preview} from "@storybook/react";
import {withThemeByClassName} from '@storybook/addon-themes';
import {initialize, mswLoader} from "msw-storybook-addon";


initialize();

const preview: Preview = {
    parameters: {
        // existing properties
        darkMode: {
            classTarget: 'html',
            darkClass: 'dark',
            lightClass: 'light',
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'dark'
        })
    ],
    loaders: [mswLoader]
};
export default preview;
