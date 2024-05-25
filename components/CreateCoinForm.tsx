"use client";
import React, {useContext, useState} from "react";
import "./styles/form.css";
import xLogo from "@/public/twitter.png";
import telegramLogo from "@/public/telegram.png";
import webLogo from "@/public/world-wide-web.png";
import Image from "next/image";
import * as Collapsible from '@radix-ui/react-collapsible'
import {Cross2Icon, RowSpacingIcon} from '@radix-ui/react-icons';
import {AppConfigContext, PrismaClientContext} from "@/components/Contexts";
import {Prisma} from "@/lib/prisma/client";
import {useForm} from 'react-hook-form';
import {useToast} from "@/components/ui/use-toast";
import Link from "next/link";
import {ConnectButton, useAccounts, useSignPersonalMessage, useSuiClient, useWallets} from "@mysten/dapp-kit";
import {ToastAction} from "@/components/ui/toast";
import {coinRestApi, ThreadPostRequest} from "@/lib/rest";
import {faker} from "@faker-js/faker";


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
type FormData = {
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
    const prismaClient = useContext(PrismaClientContext);
    const appConfig = useContext(AppConfigContext);
    const suiClient = useSuiClient();
    const [wallet] = useWallets()
    const [account] = useAccounts()
    const {toast} = useToast()
    const [fatalError, setFatalError] = useState<string | null>(null);

    const dev_name = `${faker.word.words({count: {min: 1, max: 3}}).replace(" ", "_")}`
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, isSubmitted, touchedFields}
    } = useForm<FormData>({
        // TODO Below has a bunch of default values for testing, remove this
        defaultValues: {
            // creator: "",
            // module: isDevMode ? `${dev_name.toLowerCase()}` : "",
            // packageId: "",
            // storeId: "",
            //There items do need to be set in the form
            name: isDevMode ? `${faker.lorem.words({min: 1, max: 3})}` : "",
            symbol: isDevMode ? `${dev_name.toUpperCase().replace("_", "").slice(0, 3)}` : "",
            description: isDevMode ? `${faker.lorem.sentence({min: 30, max: 120})}` : "",
            decimals: 3,
            iconUrl: isDevMode ? "https://static-production.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" : "",
            website: isDevMode ? "https://www.npmjs.com/package/@mysten/sui.js/v/0.0.0-experimental-20230127130009?activeTab=readme" : "",
            twitterUrl: isDevMode ? "https://twitter.com/dog_rates" : "",
            discordUrl: isDevMode ? "https://discord.gg/eHz9E7qP" : "",
            telegramUrl: "",
            target: 5_000_000, //TODO Get rid of hardcoding immediately
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


    const submit = async (data: FormData) => {
        try {
            if(!account) {
                toast({
                    title: "Failed to create coin",
                    duration: 3000,
                    variant: "destructive",
                    description: "You must connect your Sui wallet to create a coin",
                })
            }
            // const result = await appConfig.axios.post("/coins", data)
            mutate(
                {
                    message: new TextEncoder().encode(data.symbol),
                },
                {
                    onSuccess: async (signature) => {
                        console.log("signature", signature)
                        try {

                            const token = {...data, signature: signature.signature};
                            const result = await coinRestApi.postCoin({appConfig, token} ); //TODO Fix this
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
                        } catch (e) {
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

    const ErrorSpan = ({name}: { name: keyof Prisma.CoinCreateInput }) => {
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
                <input
                    type="text"
                    placeholder="Name"
                    {...register("name", {required: true, pattern: /^[A-Za-z ]+$/i})}
                    className="new-coin-input-field"
                />
                <ErrorSpan name="name"/>
            </div>
            <div>
                <label htmlFor="symbol" className="block text-[#48d7ff]">
                    Ticker
                </label>
                {/*TODO look up the limits of a ticker, max size, symbols allowed, etc*/}
                <input
                    type="text"
                    {...register("symbol", {required: true, pattern: /^[A-Za-z0-9]+$/i})}
                    placeholder="Ticker"
                    className="new-coin-input-field"
                />
                <ErrorSpan name="symbol"/>
            </div>
            <div>
                <label htmlFor="description" className="block text-[#48d7ff]">
                    Description
                </label>
                <input
                    type="text"
                    {...register("description")}
                    placeholder="Description"
                    className="new-coin-input-field"
                />
                <ErrorSpan name="description"/>
            </div>
            <div>
                <label htmlFor="target" className="block text-[#48d7ff]">
                    Target
                </label>
                <input
                    type="text"
                    {...register("target")}
                    placeholder="Description"
                    className="new-coin-input-field"
                />
                <ErrorSpan name="target"/>
            </div>
            {/*<div*/}
            {/*    {...getRootProps()}*/}
            {/*    className="flex relative flex-col items-center justify-center p-5 border-dashed bg-[#4b6a7d7d] border border-gray-300 text-gray-400 rounded"*/}
            {/*>*/}
            {/*    <input {...getInputProps()} />*/}
            {/*{form.image[0] ? (*/}
            {/*    <div className=" absolute size-full group hover:bg-slate-400/5">*/}
            {/*        <p className="ml-2 on hidden group-hover:block text-slate-400  text-center">*/}
            {/*            {isDragActive*/}
            {/*                ? "Drop the files here ..."*/}
            {/*                : "Drag 'n' drop Image, or click to select Image"}*/}
            {/*        </p>*/}
            {/*    </div>*/}
            {/*) : (*/}
            {/*    <>*/}
            {/*        <Image src={DND} alt="drag and drop" className=" size-[4rem]"/>*/}
            {/*        <p className="ml-2">*/}
            {/*            {isDragActive*/}
            {/*                ? "Drop the files here ..."*/}
            {/*                : "Drag 'n' drop Image, or click to select Image"}*/}
            {/*        </p>*/}
            {/*    </>*/}
            {/*)}*/}
            {/*{form.image[0] && (*/}
            {iconUrl && (
                <Image
                    // src={form.image[0].preview}
                    src={iconUrl}
                    alt="image preview"
                    width={500}
                    height={300}
                    className=" max-w-full max-h-[300px]"
                />
            )}
            <div>
                <label htmlFor="iconUrl" className="block text-[#48d7ff]">
                    Icon URL
                </label>
                {/*TODO require URL, warn if its not a URL*/}
                {/*TODO Look up if there's any constraints on the image url, like recommended sizes*/}
                <input
                    type="text"
                    {...register("iconUrl")}
                    placeholder="Token Icon URL"
                    className="new-coin-input-field"
                />
                <ErrorSpan name="iconUrl"/>
            </div>
            {/*</div>*/}
            <Collapsible.Root open={showLinks} onOpenChange={setShowLinks}>

                <div className=" flex items-center justify-between mb-5">
        <span className="text-violet11 text-[15px] leading-[25px] text-[#48d7ff]">
          Add social links
        </span>
                    <Collapsible.Trigger asChild>
                        <button
                            className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none data-[state=closed]:bg-white data-[state=open]:bg-violet3 hover:bg-violet3 focus:shadow-[0_0_0_2px] focus:shadow-black">
                            {showLinks ? <Cross2Icon/> : <RowSpacingIcon/>}
                        </button>
                    </Collapsible.Trigger>
                </div>

                <Collapsible.Content>
                    <div className=" flex gap-5 items-center">
                        <Image src={webLogo} alt="web" className=" size-6 "/>
                        <input
                            type="text"
                            {...register("website")}
                            placeholder="Website"
                            className="new-coin-input-field"
                        />
                        <ErrorSpan name="website"/>
                    </div>
                    <div className=" flex gap-5 items-center">
                        <Image src={xLogo} alt="X" className=" size-6 "/>
                        <input
                            type="text"
                            {...register("twitterUrl")}
                            placeholder="X"
                            className="new-coin-input-field"
                        />
                        <ErrorSpan name="twitterUrl"/>
                    </div>
                    <div className=" flex gap-5 items-center">
                        <Image src={telegramLogo} alt="telegram" className=" size-6 "/>
                        <input
                            type="text"
                            {...register("telegramUrl")}
                            placeholder="Telegram"
                            className="new-coin-input-field -z"
                        />
                        <ErrorSpan name="telegramUrl"/>
                    </div>

                    <div className=" flex gap-5 items-center">
                        {/*TODO needs discord logo*/}
                        <Image src={telegramLogo} alt="discord" className=" size-6 "/>
                        <input
                            type="text"
                            {...register("discordUrl")}
                            placeholder="Discord"
                            className="new-coin-input-field -z"
                        />
                        <ErrorSpan name="discordUrl"/>
                    </div>
                    <div className=" flex gap-5 items-center">
                        {/*TODO find an icon for the whitepaper*/}
                        <Image src={webLogo} alt="whitepaperUrl" className=" size-6 "/>
                        <input
                            type="text"
                            {...register("whitepaperUrl")}
                            placeholder="Whitepaper"
                            className="new-coin-input-field"
                        />
                        <ErrorSpan name="whitepaperUrl"/>
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
            {fatalError && (<div className="text-red-500 text-xs mt-1">{fatalError}</div>)}
            {!account
                ? <ConnectButton connectText={"Connect wallet to create coin"}/>
                : <button
                    type="submit"
                    className="btn p-2 hover:text-[#5ea9ff] hover:bg-[#5db6ff42] text-white rounded w-full md:w-1/2 mx-auto block"
                >
                    Create Coin
                </button>}
        </form>
    );
};

export default CreateCoinForm;
