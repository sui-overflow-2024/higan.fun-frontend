import type {Meta, StoryObj} from '@storybook/react';
import {TokenHolders} from "@/stories/TokenHolders";
import {http, HttpResponse} from "msw";


const meta: Meta<typeof TokenHolders> = {
    title: "Higan/TokenHolders",
    component: TokenHolders
};

export default meta


type Story = StoryObj<typeof meta>;

const defaultArgs = {
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
}
export const Default: Story = {
    args: defaultArgs,
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/coins/0x8cb5bc618d9943730a9404ad11143b9588dcd2033033cb6ded0c1bf87c4ceab3/holders', () => {
                    console.log("HIT mOCK")
                    return HttpResponse.json([
                        {address: "0xD11a46B2bF25fbcD6ef8F14221B2CdEeD0Ec6938", balance: 10_000},
                        {address: "0xFf9f1FD7321218F34f3a85B91C052a40B3ca855D", balance: 10_000},
                        {address: "0x8593F7fABd03C818b3fDd55Deb42423dEA203162", balance: 50_000},
                        {address: "0x04620127E25637F822C49B10a4a4e187389BD581", balance: 120_000},
                        {address: "0xc212Ff4122602FF869A400394371A8EdBD012e71", balance: 70_000},
                        {address: "0x3e692818bd102dbb5ccD7533BfE11dE699f3578b", balance: 130_000},
                        {address: "0xF12A42DB31b176422EC6F38F8537D55FC56A7177", balance: 60_000},
                        {address: "0x9c247f6140116EE8C3f68b7bda9E361C2C5E71d8", balance: 210_000},
                        {address: "0x567E0D740865A81b575727912Dd1dc668F30FBc1", balance: 140_000},
                        {address: "0x35a64CB2dACF3a9602fbaBc998a99847ade356F4", balance: 200_000},
                        {address: "0xDfd186eac88c57B170C0ed8267323385B0F3078a", balance: 200_000},
                        {address: "0x8105A6b49eD8EFb5Af3ec9ca6f1C6ad908485A7D", balance: 0},
                        {address: "0x7b611d4e5b6B2F588694Fdcb9dB3ceA3214Df267", balance: 0},
                        {address: "0xA90d035df6fFbDe87002D4DDEC5Fa083EA8152B2", balance: 0},
                        {address: "0x7F9D36c9AfD2c67eF10B095136399873dF4895b0", balance: 0},
                        {address: "0xa869a3E43e0F09179Ff556F598840ddCD0F16d2f", balance: 0},
                        {address: "0xdd07FdD1a0B32Bc5f2EEdFff3B1F2bAdc5BE8293", balance: 0},
                        {address: "0xfE40007AF89B0d1D312F57D54b73E8c9A9Cb4D27", balance: 0},
                        {address: "0xEEe46Cf8b6c5e32684872a3BDCD9A483A6349575", balance: 0},
                        {address: "0xE6C26Cc39daF3a21D8fc6DBF7d8Ba0180e4C46dd", balance: 0},
                    ]);
                }),
            ],
        },
    },
};


let animatedCache = [
    {address: "0xD11a46B2bF25fbcD6ef8F14221B2CdEeD0Ec6938", balance: 10_000},
    {address: "0xFf9f1FD7321218F34f3a85B91C052a40B3ca855D", balance: 10_000},
    {address: "0x8593F7fABd03C818b3fDd55Deb42423dEA203162", balance: 50_000},
    {address: "0x04620127E25637F822C49B10a4a4e187389BD581", balance: 120_000},
    {address: "0xc212Ff4122602FF869A400394371A8EdBD012e71", balance: 70_000},
    {address: "0x3e692818bd102dbb5ccD7533BfE11dE699f3578b", balance: 130_000},
    {address: "0xF12A42DB31b176422EC6F38F8537D55FC56A7177", balance: 60_000},
    {address: "0x9c247f6140116EE8C3f68b7bda9E361C2C5E71d8", balance: 210_000},
    {address: "0x567E0D740865A81b575727912Dd1dc668F30FBc1", balance: 140_000},
    {address: "0x35a64CB2dACF3a9602fbaBc998a99847ade356F4", balance: 100_000},
    {address: "0xDfd186eac88c57B170C0ed8267323385B0F3078a", balance: 200_000},
    {address: "0x8105A6b49eD8EFb5Af3ec9ca6f1C6ad908485A7D", balance: 10_000},
    {address: "0x7b611d4e5b6B2F588694Fdcb9dB3ceA3214Df267", balance: 10_000},
    {address: "0xA90d035df6fFbDe87002D4DDEC5Fa083EA8152B2", balance: 10_000},
    {address: "0x7F9D36c9AfD2c67eF10B095136399873dF4895b0", balance: 10_000},
    {address: "0xa869a3E43e0F09179Ff556F598840ddCD0F16d2f", balance: 10_000},
    {address: "0xdd07FdD1a0B32Bc5f2EEdFff3B1F2bAdc5BE8293", balance: 10_000},
    {address: "0xfE40007AF89B0d1D312F57D54b73E8c9A9Cb4D27", balance: 10_000},
    {address: "0xEEe46Cf8b6c5e32684872a3BDCD9A483A6349575", balance: 10_000},
    {address: "0xE6C26Cc39daF3a21D8fc6DBF7d8Ba0180e4C46dd", balance: 10_000},
]

function updateRandomBalances() {
    if (animatedCache.length < 2) {
        console.warn("Need at least two holders to perform the operation");
        return;
    }

    // Pick a random entry to subtract from
    const fromIndex = Math.floor(Math.random() * animatedCache.length);
    const fromHolder = animatedCache[fromIndex];

    // Determine the maximum amount that can be subtracted
    const maxSubtract = fromHolder.balance - 1; // Ensure balance doesn't go below 1
    if (maxSubtract <= 0) {
        console.warn("Selected holder doesn't have enough balance to subtract from");
        return animatedCache;
    }

    // Subtract a random amount
    const amountToSubtract = Math.floor(Math.random() * maxSubtract) + 1;
    fromHolder.balance -= amountToSubtract;

    // Pick a random entry to add to (ensuring it's different from the 'from' entry)
    let toIndex;
    do {
        toIndex = Math.floor(Math.random() * animatedCache.length);
    } while (toIndex === fromIndex);

    // Add the subtracted amount to the selected entry
    animatedCache[toIndex].balance += amountToSubtract;

    return animatedCache;
}

export const Animated: Story = {
    args: {
        token: {
            ...defaultArgs.token,
            bondingCurveId: "0x9999999999999999999999999999999999999999999999999999999999999999"
        },
        tokenMetrics: {
            ...Default.args?.tokenMetrics,
            totalSupply: 100_000_000,
            tokenPrice: 100,
            suiBalance: 1000,
        },
    },
    parameters: {
        msw: {
            handlers: [
                http.get('http://localhost:3000/coins/0x9999999999999999999999999999999999999999999999999999999999999999/holders', () => {
                    console.log("HIT mOCK")
                    updateRandomBalances()
                    return HttpResponse.json(animatedCache);
                }),
            ],
        }
    }
}