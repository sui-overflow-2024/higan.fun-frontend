"use client";
import React, {useState} from "react";
import {useForm} from 'react-hook-form';
import {useToast} from "@/components/ui/use-toast";
import {ConnectButton, useAccounts, useSuiClientQuery} from "@mysten/dapp-kit";
import {faker} from "@faker-js/faker";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {TransactionBlock} from "@mysten/sui.js/transactions";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";
import {AppConfigContext} from "@/components/Contexts";
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useContextSelector} from "use-context-selector";


export type CreateCoinFormData = {
    decimals: number;
    name: string;
    symbol: string;
    description: string;
    iconUrl: string;
    websiteUrl: string;
    twitterUrl: string;
    discordUrl: string;
    telegramUrl: string;
    target: number;
}

const schema = yup.object().shape({
    name: yup.string().required('Name is required.').matches(/^[A-Za-z0-9 ]+$/i, 'Name cannot contain numbers.'),
    symbol: yup.string().required('Ticker is required.'),
    description: yup.string().optional().max(1000, 'Description cannot be more than 1000 characters.').default(""),
    target: yup.number().required('Target is required.').min(1_000_000_000),
    iconUrl: yup.string().required('Icon URL is required.'), //Not technically required, but in the right spirit
    websiteUrl: yup.string().optional().default(""),
    twitterUrl: yup.string().optional().default(""),
    discordUrl: yup.string().optional().default(""),
    telegramUrl: yup.string().optional().default(""),
    decimals: yup.number().required('Decimals is required.').min(0).max(18).default(3),
});

const CreateCoinForm = () => {
        const isDevMode = process.env.NODE_ENV === "development";
        const managerContractPackageId = useContextSelector(AppConfigContext, v => v.managerContractPackageId);
        const managerContractModuleName = useContextSelector(AppConfigContext, v => v.managerContractModuleName);
        const managerContractConfigId = useContextSelector(AppConfigContext, v => v.managerContractConfigId);

        const [account] = useAccounts()
        const {toast} = useToast()
        const [fatalError, setFatalError] = useState<string | null>(null);
        const executeTransaction = useTransactionExecution()
        const {data: configurator, error: fetchConfiguratorError} = useSuiClientQuery('getObject', {
            id: "0xc2d828e8535ce4e06fe9736277af4f7635b0780a770f70c6d4c71e174d47e77b",
            options: {
                showContent: true,
                showBcs: true,
                showDisplay: true,
                showOwner: true,
                showType: true,
                showPreviousTransaction: true,
                showStorageRebate: true,
            }
        });
        console.log("configurator", configurator)
        console.log("fetchConfiguratorError", fetchConfiguratorError)
        const dev_name = `${faker.word.words({count: {min: 1, max: 3}}).replace(" ", "_")}`
        const {
            register,
            handleSubmit,
            watch,
            formState: {errors, isSubmitted, touchedFields}
        } = useForm<CreateCoinFormData>({
            defaultValues: {
                name: isDevMode ? `${faker.lorem.words({min: 1, max: 3})}` : "",
                symbol: isDevMode ? `${dev_name.toUpperCase().replace("_", "").slice(0, 3)}` : "",
                description: isDevMode ? `${faker.lorem.sentence({min: 30, max: 120})}` : "",
                decimals: 3,
                iconUrl: isDevMode ? "https://static-production.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" : "",
                websiteUrl: isDevMode ? "https://www.npmjs.com/package/@mysten/sui.js/v/0.0.0-experimental-20230127130009?activeTab=readme" : "",
                twitterUrl: isDevMode ? "https://twitter.com/dog_rates" : "",
                discordUrl: isDevMode ? "https://discord.gg/eHz9E7qP" : "",
                telegramUrl: "https://icon-sets.iconify.design/mdi/chevron-up-down/",
                target: 5_000_000_000,
            },
            resolver: yupResolver(schema)
        });
        const iconUrl = watch('iconUrl');

        const submit = async (data: CreateCoinFormData) => {
            try {
                if (!account) {
                    return
                }
                const txb = new TransactionBlock();
                //TODO get from config
                const [payment] = txb.splitCoins(txb.gas, [txb.pure(5_000_000_000)]);
                txb.moveCall({
                    target: `${managerContractPackageId}::${managerContractModuleName}::prepare_to_list`,
                    arguments: [
                        txb.object(managerContractConfigId),
                        txb.object(payment),
                        txb.pure.string(data.name),
                        txb.pure.string(data.symbol),
                        txb.pure.string(data.description),
                        txb.pure.u64(data.target),
                        txb.pure.string(data.iconUrl),
                        txb.pure.string(data.websiteUrl),
                        txb.pure.string(data.telegramUrl),
                        txb.pure.string(data.discordUrl),
                        txb.pure.string(data.twitterUrl),
                    ],
                })
                //TODO below gives you a toast message because the tx was successful,
                // but that doesn't mean the backend created it. Really we shouldn't show a toast
                // and should instead
                await executeTransaction(txb)
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
                <div>
                    <div className={"flex-col"}>
                        <label htmlFor="website" className="block text-[#48d7ff]">
                            Website URL
                        </label>
                        {/*<Image src={webLogo} alt="web" className=" size-6 "/>*/}
                    </div>
                    <Input
                        // Icon={webLogo}
                        type="text"
                        {...register("websiteUrl")}
                        placeholder="Website"
                    />
                    <ErrorSpan name="websiteUrl"/>
                </div>
                <div>
                    <label htmlFor="twitterUrl" className="block text-[#48d7ff]">
                        X URL
                    </label>
                    {/*<Image src={xLogo} alt="X" className=" size-6 "/>*/}
                    <Input
                        type="text"
                        {...register("twitterUrl")}
                        placeholder="X"
                    />
                    <ErrorSpan name="twitterUrl"/>
                </div>
                <div>
                    <label htmlFor="telegramUrl" className="block text-[#48d7ff]">
                        Telegram URL
                    </label>
                    {/*<Image src={telegramLogo} alt="telegram" className="bg-sea color-sea size-6 "/>*/}
                    <Input
                        type="text"
                        {...register("telegramUrl")}
                        placeholder="Telegram"
                    />
                    <ErrorSpan name="telegramUrl"/>
                </div>

                <div>
                    <label htmlFor="discordUrl" className="block text-[#48d7ff]">
                        Discord Server URL
                    </label>
                    {/*<Image src={discordLogo} alt="discord" className=" size-6 "/>*/}
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
    }
;

export default CreateCoinForm;
