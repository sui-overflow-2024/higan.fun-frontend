import type {NextApiRequest, NextApiResponse} from 'next'
import {TokenWithAdditionalMetadata} from "@/lib/types";
import handlebars from 'handlebars';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const tokenTemplate = handlebars.compile(`
module we_hate_the_ui_contracts::{{name_snake_case}} {
    use std::option;
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    /// Name of the coin. By convention, this type has the same name as its parent module
    /// and has no fields. The full type of the coin defined by this module will be COIN<{{token_sname_case_caps}}>.
    /// Note: For some reason the OTW has to be named the same as the address
    public struct {{name_snake_case_caps}} has drop {}

    /// Register the managed currency to acquire its TreasuryCap. Because
    /// this is a module initializer, it ensures the currency only gets
    /// registered once.
    fun init(witness: {{name_snake_case_caps}}, ctx: &mut TxContext) {
        // Get a treasury cap for the coin and give it to the transaction sender
        let (treasury_cap, metadata) = coin::create_currency<{{name_snake_case_caps}}>(witness, {{decimals}}, b"{{name_snake_case_caps}}", b"{{symbol}}", b"{{description}}", b"{{icon_url}}", ctx);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx))
    }

    /// Manager can mint new coins
    public fun mint(
        treasury_cap: &mut TreasuryCap<{{name_snake_case_caps}}>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx)
    }

    /// Manager can burn coins
    public fun burn(treasury_cap: &mut TreasuryCap<{{name_snake_case_caps}}>, coin: Coin<{{name_snake_case_caps}}>) {
        coin::burn(treasury_cap, coin);
    }

    public fun transfer_cap(treasury_cap: TreasuryCap<{{name_snake_case_caps}}>, target: address){
        //I'm not positive this is secure, in theory: There is only one treasury cap, the person who called init has it,
        // so the only person who should be able to transfer it in the person who called init?
        transfer::public_transfer(treasury_cap, target);
    }
}`)
export async function GET(req: NextApiRequest){
    //TODO Need pagination
    return prisma.coin.findMany()
}
export async function POST(
    req: NextApiRequest,
    res: NextApiResponse<TokenWithAdditionalMetadata | { error: string }>
) {
    try {
        const {
            creator,
            decimals,
            name,
            symbol,
            description,
            iconUrl,
            website,
            twitterUrl,
            discordUrl,
            telegramUrl,
        } = req.body;

        // @voyager, put your Sui logic to create the coin here
        // If we can't do this on chain, I think the rough steps are:
        // First version: Just create a token, don't worry about collecting a fee
        // 1. Load the token template and populate it with the token details using handlebars
        const templateData = {
            name_snake_case_caps: name.replace(" ", "_").toUpperCase(),
            name_snake_case: name.toLowerCase().replace(" ", "_"),
            decimals,
            symbol,
            description,
            icon_url: iconUrl,
        };
        const tokenCode = tokenTemplate(templateData);
        // 2. See if you can deploy the token code to the chain with the Sui sdk: https://docs.sui.io/guides/developer/app-examples/weather-oracle#initialize-the-project
        // 3. (Later) Register the token with the management contract, and transfer the treasury cap to the management contract
        // Second version, later: User must submit 5 SUI to the manager contract for a fee, which we check here. User submits a signature, we extract the address, check if they paid the fee on chain, and move forward with coin creation if the have.
        console.log(tokenCode)
        const coin = await prisma.coin.create({
            data: {
                // TODO below should come from Sui deploy
                objectId: Math.random().toString(36).substring(7),
                treasuryCapId: Math.random().toString(36).substring(7),
                creator,
                decimals,
                name,
                symbol,
                description,
                iconUrl,
                website,
                twitterUrl,
                discordUrl,
                telegramUrl,
            },
        });
        return res.status(200).json(coin)
    } catch (err) {
        console.error("500 error on /createCoin", err)
        return res.status(500).json({error: `failed to load data ${err}`})
    }
}
