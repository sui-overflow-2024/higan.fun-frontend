import {addons} from '@storybook/manager-api';
import {create} from '@storybook/theming';

addons.setConfig({
    theme: create({
        base: "dark",
        appContentBg: "#000",
        appBg: "#000",
        appPreviewBg: "#000",
        brandTitle: "higan.fun"
    })
});