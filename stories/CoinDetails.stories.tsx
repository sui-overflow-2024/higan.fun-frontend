import type {Meta, StoryObj} from '@storybook/react';
import {CoinDetails} from "@/stories/CoinDetails";
import {http, HttpResponse} from 'msw';

const meta: Meta<typeof CoinDetails> = {
    title: "Higan/CoinDetails",
    component: CoinDetails
};

export default meta


type Story = StoryObj<typeof meta>;

export const Default: Story = {

    args: {
        token: {
            id: 0,
            poolId: "",
            status: 3,
            target: 50_000_000_000,
            creator: "0xb2720b42e26a7fc1eb555ecd154ef3dc2446f80c1f186af901cd38b842e52044",
            decimals: 3,
            discordUrl: "https://docs.sui.io/sui-api-ref#suix_resolvenameservicenames",
            module: "MoonyMoonMoonCoin",
            bondingCurveId: "0x8cb5bc618d9943730a9404ad11143b9588dcd2033033cb6ded0c1bf87c4ceab3",
            telegramUrl: "https://sui.io/community-events-hub",
            twitterUrl: "https://x.com/dog_rates",
            websiteUrl: "https://github.com/ad0ll/we-hate-the-ui",
            whitepaperUrl: "https://githubnext.com/projects/copilot-workspace",
            packageId: "babababababababababababababababa",
            name: "Moony Moon Moon Coin",
            symbol: "MMMMC",
            iconUrl: "./dai.svg",
            description: `Comedo quia cruciamentum valetudo vulgo considero capitulus illum tertius xiphias utor nulla cinis fugit sapiente cattus crur eligendi cura desparatus derelinquo verecundia creator confugo condico desolo ubi aufero tertius virga caelestis angelus esse tenus minus armarium appello aestus nam damno coadunatio repellendus veritas supra coruscus aequitas tendo viridis sustineo cotidie comes comptus cohaero infit comis charisma terra vapulus tristis distinctio apud accusantium super solus vorax nostrum temptatio cotidie conicio baiulus testimonium tabesco dolore avaritia blanditiis arbor sublime dicta caecus ait coniecto aegrus adduco confero cognomen timidus apto confugo ventito atavus tego bellicus curis earum undique clibanus textilis talis viscus volo comminor cariosus creta adficio quisquam vulgo nihil ara decor caput similique atavus comis dolorem vita consequatur aeneus crastinus amiculum voluptatum audentia audeo comis spectaculum numquam contra venia umquam amplexus caries atavus uter libero vesica curia dignissimos una coma uredo a curis ter speciosus volo curtus aliqua dolor terror subnecto traho celo absque odit ater absens amiculum verumtamen amet aequitas talio cibus tibi reiciendis torqueo umquam similique vito denuncio molestiae capitulus valeo cresco umerus adaugeo dolore amo quam una comparo cado stella comis decimus quis coepi aliquam suus ulterius tactus copiose tum derelinquo accommodo thorax venio vehemens speculum denique adfectus caelestis tondeo caput sodalitas sopor tertius aspernatur abeo veritas virgo asporto sint utilis conscendo sapiente viduo spiculum veritas spes aggredior eum sol tenetur comedo viridis admoneo considero vito tres rem arcus totidem solum trucido praesentium via supra pariatur tactus fugiat aetas coadunatio surculus volo maxime cernuus denego cattus vergo tum ambulo vesco corrigo valens patria thorax alveus rerum occaecati arbitro cumque amicitia adsum titulus volo vulariter sequi cicuta tersus alias aequus voluptate colo ancilla creber cura stella caste at amicitia aurum cometes cimentarius templum curiositas cuius accendo coma cur cohors soluta audax quaerat coruscus concedo agnosco minus temeritas iure textus abutor.`,
            createdAt: new Date(),
            updatedAt: new Date(),
            suiReserve: 409_750_000_000 // 0.5 - 100 SUI
        },
        tokenMetrics: {
            tokenPrice: 10_000_000_000,
            suiBalance: 10_000_000_000,
            totalSupply: 100_000_000
        }
    },
    parameters: {
        msw: {
            handlers: [
                http.get('https://hermes.pyth.network/v2/updates/price/latest?ids%5B%5D=0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744', () => {
                    console.log("HIT mOCK")
                    return HttpResponse.json({
                        parsed: [{price: 1000}],
                    });
                }),
            ],
        },
    },
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