"use client";
import React, {useContext, useState} from "react";
import xLogo from "@/public/x.svg";
import discordLogo from "@/public/discord.svg";
import telegramLogo from "@/public/telegram.svg";
import webLogo from "@/public/web.svg";
import Image from "next/image";
import {AppConfigContext} from "@/components/Contexts";
import {Prisma} from "@/lib/prisma/client";
import {useForm} from 'react-hook-form';
import {useToast} from "@/components/ui/use-toast";
import Link from "next/link";
import {ConnectButton, useAccounts, useSignPersonalMessage} from "@mysten/dapp-kit";
import {ToastAction} from "@/components/ui/toast";
import {coinRestApi} from "@/lib/rest";
import {faker} from "@faker-js/faker";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";


type MyFile = File & { preview: string };

// const postCoinSchema = Joi.object({
//     decimals: Joi.number().required(),
//     name: Joi.string().required().regex(/^[A-Za-z0-9 ]+$/),
//     symbol: Joi.string().required().regex(/^[A-Za-z0-9]+$/),
//     description: Joi.string().required(),
//     iconUrl: Joi.string().required(),
//     website: Joi.string().optional().allow(''),
//     twitterUrl: Joi.string().optional().allow(''),
//     discordUrl: Joi.string().optional().allow(''),
//     telegramUrl: Joi.string().optional().allow(''),
//     target: Joi.number().required().greater(0),
//     signature: Joi.string().required(),
// });
export type CreateCoinFormData = {
    decimals: number;
    name: string;
    symbol: string;
    description: string;
    iconUrl: string;
    website: string;
    twitterUrl: string;
    discordUrl: string;
    telegramUrl: string;
    target: number;
    signature: string;
}

const CreateCoinForm = () => {
    const isDevMode = process.env.NODE_ENV === "development";
    const appConfig = useContext(AppConfigContext);
    const [account] = useAccounts()
    const {toast} = useToast()
    const [fatalError, setFatalError] = useState<string | null>(null);

    const dev_name = `${faker.word.words({count: {min: 1, max: 3}}).replace(" ", "_")}`
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, isSubmitted, touchedFields}
    } = useForm<CreateCoinFormData>({
        // TODO Below has a bunch of default values for testing, remove this
        defaultValues: {
            name: isDevMode ? `${faker.lorem.words({min: 1, max: 3})}` : "",
            symbol: isDevMode ? `${dev_name.toUpperCase().replace("_", "").slice(0, 3)}` : "",
            description: isDevMode ? `${faker.lorem.sentence({min: 30, max: 120})}` : "",
            decimals: 3,
            iconUrl: isDevMode ? "https://static-production.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" : "",
            website: isDevMode ? "https://www.npmjs.com/package/@mysten/sui.js/v/0.0.0-experimental-20230127130009?activeTab=readme" : "",
            twitterUrl: isDevMode ? "https://twitter.com/dog_rates" : "",
            discordUrl: isDevMode ? "https://discord.gg/eHz9E7qP" : "",
            telegramUrl: "https://icon-sets.iconify.design/mdi/chevron-up-down/",
            target: 5_000_000_000, //TODO Get rid of hardcoding immediately
        }
    });
    const [showLinks, setShowLinks] = useState<boolean>(false)
    const iconUrl = watch('iconUrl');


    // TODO use a custom form schema w/ Yup instead of Prisma.CoinCreateInput so we can get this validation
    const validateForm = (form: Prisma.CoinCreateInput) => {
        let errors: { [key: string]: string } = {};

        if (!form.name) {
            errors.name = "Name is required.";
        } else if (/\d/.test(form.name)) {
            errors.name = "Name cannot contain numbers.";
        }

        if (!form.symbol) {
            errors.ticker = "Ticker is required.";
        }

        if (!form.description) {
            errors.description = "Description is required.";
        } else if (form.description.length > 200) {
            errors.description = "Description cannot be more than 200 characters.";
        }

        return errors;
    };

    const {mutate} = useSignPersonalMessage()


    const submit = async (data: CreateCoinFormData) => {
        try {
            if (!account) {
                return
            }
            mutate(
                {
                    message: new TextEncoder().encode(data.symbol),
                },
                {
                    onSuccess: async (signature) => {
                        console.log("signature", signature)
                        try {

                            const token = {...data, signature: signature.signature};
                            const result = await coinRestApi.postCoin({appConfig, token}); //TODO Fix this
                            // TODO, take packageId from the result, link to sui explorer, link must be aware of the network the user currently has selected
                            // Couldn't do this first pass because the dapp docs were broken
                            console.log("result", result)
                            toast({
                                title: "Successfully launched your coin!",
                                duration: 3000,
                                action: (
                                    <ToastAction altText="View your token">
                                        <Link href={`/coin/${result.packageId}`}>
                                            Go to landing page
                                        </Link>
                                    </ToastAction>
                                ),
                            })
                        } catch (e: any) {
                            toast({
                                title: "Failed to create coin",
                                duration: 3000,
                                variant: "destructive",
                                description: e.message,
                            })
                            console.error(e);
                            setFatalError(e.message);
                        }

                    },
                },
            );

        } catch (e: any) {
            toast({
                title: "Failed to create coin",
                duration: 3000,
                variant: "destructive",
                description: e.message,
            })
            console.error(e);
            setFatalError(e.message);
        }
    }

    const ErrorSpan = ({name}: { name: keyof CreateCoinFormData }) => {
        return (!isSubmitted || touchedFields[name]) && errors[name] && (
            <span className="text-red-500 text-xs mt-1">{errors[name]?.message}</span>
        );
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4 ">
            <div>
                <label htmlFor="name" className="block text-[#48d7ff]">
                    Name
                </label>
                <Input
                    type="text"
                    placeholder="Name"
                    {...register("name", {required: true, pattern: /^[A-Za-z ]+$/i})}
                />
                <ErrorSpan name="name"/>
            </div>
            <div>
                <label htmlFor="symbol" className="block text-[#48d7ff]">
                    Ticker
                </label>
                {/*TODO look up the limits of a ticker, max size, symbols allowed, etc*/}
                <Input
                    type="text"
                    {...register("symbol", {required: true, pattern: /^[A-Za-z0-9]+$/i})}
                    placeholder="Ticker"
                />
                <ErrorSpan name="symbol"/>
            </div>
            <div>
                <label htmlFor="description" className="block text-[#48d7ff]">
                    Description
                </label>
                <Input
                    type="text"
                    {...register("description")}
                    placeholder="Description"
                />
                <ErrorSpan name="description"/>
            </div>
            <div>
                <label htmlFor="target" className="block text-[#48d7ff]">
                    Target
                </label>
                <Input
                    type="text"
                    {...register("target")}
                    placeholder="Description"
                />
                <ErrorSpan name="target"/>
            </div>
            <div>
                <label htmlFor="iconUrl" className="block text-[#48d7ff]">
                    Icon URL
                </label>
                {/*TODO require URL, warn if its not a URL*/}
                {/*TODO Look up if there's any constraints on the image url, like recommended sizes*/}
                <Input
                    type="text"
                    {...register("iconUrl")}
                    placeholder="Token Icon URL"
                />
                <ErrorSpan name="iconUrl"/>
            </div>
            <div className={"flex justify-center"}>

                {iconUrl && (
                    <img
                        src={iconUrl || ""}
                        alt="image preview"
                        width={300}
                        height={300}
                        className=" max-w-full max-h-[300px]"
                    />
                )}
            </div>
            <div className=" flex gap-5 items-center">
                <label htmlFor="website" className="block text-[#48d7ff]">
                    Website URL
                </label>
                <Image src={webLogo} alt="web" className=" size-6 "/>
                <Input
                    type="text"
                    {...register("website")}
                    placeholder="Website"
                />
                <ErrorSpan name="website"/>
            </div>
            <div className=" flex gap-5 items-center">
                <label htmlFor="twitterUrl" className="block text-[#48d7ff]">
                    X URL
                </label>
                <Image src={xLogo} alt="X" className=" size-6 "/>
                <Input
                    type="text"
                    {...register("twitterUrl")}
                    placeholder="X"
                />
                <ErrorSpan name="twitterUrl"/>
            </div>
            <div className=" flex gap-5 items-center">
                <label htmlFor="telegramUrl" className="block text-[#48d7ff]">
                    Telegram URL
                </label>
                <Image src={telegramLogo} alt="telegram" className="bg-sea color-sea size-6 "/>
                <Input
                    type="text"
                    {...register("telegramUrl")}
                    placeholder="Telegram"
                />
                <ErrorSpan name="telegramUrl"/>
            </div>

            <div className=" flex gap-5 items-center">
                <label htmlFor="discordUrl" className="block text-[#48d7ff]">
                    Discord Server URL
                </label>
                <Image src={discordLogo} alt="discord" className=" size-6 "/>
                <Input
                    type="text"
                    {...register("discordUrl")}
                    placeholder="Discord"
                />
                <ErrorSpan name="discordUrl"/>
            </div>

            {fatalError && (<div className="text-red-500 text-xs mt-1">{fatalError}</div>)}
            <div className="text-center">
                {!account
                    ? <ConnectButton connectText={"Connect wallet to create coin"}/>
                    : <Button type="submit" size={"lg"}>CREATE COIN</Button>}
            </div>
        </form>
    );
};

export default CreateCoinForm;
