import React, {FC, useContext} from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import {PostFromRestAPI} from "@/lib/types";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {ConnectButton, useCurrentAccount, useSignPersonalMessage, useSuiClient} from "@mysten/dapp-kit";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {getRandomNumber} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";
import {coinRestApi, ThreadPostRequest} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
import {formatDistanceToNow} from "date-fns";

const SafeMarkdown = ({text}: { text: string }) => {
    const md = new MarkdownIt();
    const sanitizedHTML = DOMPurify.sanitize(md.render(text));
    return <div dangerouslySetInnerHTML={{__html: sanitizedHTML}}/>

}
const Post: FC<{ id: number, creator: string, authorId: string, text: string, createdAt: Date }> = ({
        id,
        creator,
        authorId,
        text,
        createdAt
    }) => {
    return (
        <div className="rounded-sm overflow-hidden bg-gray-800 text-sm p-4 space-y-1 min-w-full">
            {/*TODO, setting text style below hides links in Markdown*/}
            <div className={"flex gap-2 text-xs text-muted-foreground"}>
                <CreatorAddressChip address={authorId} variant={"small"}
                                    isCreator={creator !== "" && creator === authorId}/>
                <p>{formatDistanceToNow(new Date(createdAt), {addSuffix: true})}</p> <p>#{id.toString()}</p>
            </div>
            <SafeMarkdown text={text}/>
        </div>
    );


}
const NewPostTextbox: FC<{ creator: string, coinId: string }> = ({creator, coinId}) => {
    const account = useCurrentAccount()
    const appConfig = useContext(AppConfigContext)
    const {register, handleSubmit, watch, reset} = useForm<{ text: string }>({
        defaultValues: {
            text: ""
        }
    });
    const {mutate} = useSignPersonalMessage()
    if (!account) {
        return <ConnectButton connectText={"Connect wallet to reply"}/>
    }

    const submitPost = async (data: any) => {
        console.log(data)
        mutate(
            {
                message: new TextEncoder().encode(data.text),
            },
            {
                onSuccess: async (signature) => {
                    console.log("signature", signature)
                    const postData: ThreadPostRequest = {
                        signature: signature.signature,
                        coinId: coinId,
                        text: data.text,
                        author: account.address
                    }
                    console.log("postData", postData)
                    const thread = await coinRestApi.postThread({appConfig, post: postData})
                    console.log("threadResponse", thread)
                    reset({text: ""});
                },
            },
        );
        //TODO: notify parent? parent already refetches posts each x seconds passed
    }

    return <form onSubmit={handleSubmit(submitPost)} className={"min-w-[400px]"}>

        <Textarea {...register("text", {required: true})} placeholder="Type your message here. Supports markdown."/>

        <div className={"flex gap-4 justify-center"}>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"outline"} className={"min-w-24"}>Preview</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Preview post</DialogTitle>
                        <DialogDescription>
                            This is how your post will look like to others
                        </DialogDescription>
                    </DialogHeader>
                    <Post id={getRandomNumber(1, 1000)} creator={creator}
                          authorId={account.address} text={watch("text")} createdAt={new Date()}/>
                </DialogContent>
            </Dialog>

            <Button type={"submit"} className={"min-w-24"}>Post</Button>
        </div>
    </form>
}

export const CoinThread: FC<{ coinId: string, creator: string, posts: PostFromRestAPI[] }> = ({creator, coinId, posts}) => {
    return (
        <div className={"space-y-3"}>
            <div className={"flex justify-center"}>
                <NewPostTextbox creator={creator} coinId={coinId}/>
            </div>
            {posts.map((post) => (
                <Post key={post.id} creator={creator} {...post}/>
            ))}
        </div>
    );
}