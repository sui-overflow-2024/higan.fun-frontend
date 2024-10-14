import type {Meta, StoryObj} from '@storybook/react';
import NewTokenChart from "@/stories/NewTokenChart";

const meta: Meta<typeof NewTokenChart> = {
    title: "Higan/NewTokenChart",
    component: NewTokenChart
};

export default meta


type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
    parameters: {
        // msw: {
        //     handlers: [
        //         http.get('https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744', () => {
        //             console.log("HIT mOCK")
        //             return HttpResponse.json({
        //                 parsed: [{price: 1000}],
        //             });
        //         }),
        //     ],
        // },
    }
};

// console.log("token args:", Default.args?.token)
// export const LongNameAndMixedCaseSymbol: Story = {
//     args: {
//         token: {
//             ...Default.args.token,
//             name: "Comedo quia cruciamentum valetudo vulgo considero capitulus illum tertius xiphias utor nulla",
//             symbol: "CqCVVccUTXUTN",
//         }
//     }
// }