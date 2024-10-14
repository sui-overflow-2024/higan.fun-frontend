import type {Meta, StoryObj} from '@storybook/react';
import {TokenCard2} from "@/stories/TokenCard2";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Higan/TokenCard',
    component: TokenCard2,
    parameters: {
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {},
} satisfies Meta<typeof TokenCard2>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        bondingCurveId: 'bacbdbababcbdbe827271919',
        name: "Token Card Much Wow",
        symbol: 'TOK',
        iconUrl: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages-wixmp-ed30a86b8c4ca887773594c2.wixmp.com%2Ff%2F151fe8ed-f807-4fb6-964d-536334674a05%2Fd52lmrq-d7bbc785-06e5-4da5-a82a-91424c5e442a.jpg%2Fv1%2Ffill%2Fw_775%2Ch_1031%2Cq_70%2Cstrp%2Fmario_kart_japanese_ukiyo_e_by_thejedhenry_d52lmrq-pre.jpg%3Ftoken%3DeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTE4NiIsInBhdGgiOiJcL2ZcLzE1MWZlOGVkLWY4MDctNGZiNi05NjRkLTUzNjMzNDY3NGEwNVwvZDUybG1ycS1kN2JiYzc4NS0wNmU1LTRkYTUtYTgyYS05MTQyNGM1ZTQ0MmEuanBnIiwid2lkdGgiOiI8PTg5MSJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.-okRSxdv7B8ku5jsM7BgPKI2he5tkhh624DbNn-Kfxo&f=1&nofb=1&ipt=b08c60e7445535f0177956d8981c25a8539db69f3c12ee6b0ac4f6f8b019fd30&ipo=images',
        suiReserve: 5000,
        creator: "0x7176223a57d720111be2c805139be7192fc5522597e6210ae35d4b2199949501",
        description: "Labore proident labore fugiat eu commodo sit exercitation culpa id nisi ullamco quis voluptate consequat ad aliqua dolore sed ad reprehenderit aliqua sed veniam pariatur enim excepteur aliquip officia in commodo commodo voluptate dolor culpa veniam ex incididunt amet reprehenderit ea consectetur culpa labore sed reprehenderit aliqua consequat aliquip minim est ullamco excepteur dolore occaecat reprehenderit duis enim ex voluptate id consectetur proident cillum eu non eiusmod ea minim enim duis aliqua voluptate commodo dolor sint magna id proident labore non velit ad laborum esse excepteur reprehenderit sint ipsum minim id ut lorem fugiat sit id sint sunt consequat consectetur ipsum et sunt amet proident veniam sed ut veniam commodo proident do aliquip dolore amet aute ullamco nisi lorem excepteur ullamco occaecat nulla non anim anim cupidatat sed",
    },
};
