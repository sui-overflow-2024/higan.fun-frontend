'use client'
import React, {FC, useEffect} from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import {PostFromRestAPI} from "@/lib/types";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";
import {ConnectButton, useCurrentAccount, useSignPersonalMessage} from "@mysten/dapp-kit";
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
import {getRandomNumber} from "@/lib/generators";
import {Textarea} from "@/components/ui/textarea";
import {CoinGetPostsKey, coinRestApi, ThreadPostRequest} from "@/lib/rest";
import {AppConfigContext} from "@/components/Contexts";
import {formatDistanceToNow} from "date-fns";
import useSWR, {KeyedMutator} from "swr";
import {useContextSelector} from "use-context-selector";

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
            <div className={"flex gap-2 text-xs"}>
                <CreatorAddressChip address={authorId} variant={"small"}
                                    isCreator={creator !== "" && creator === authorId}/>
                <p className={"text-muted-foreground"}>{formatDistanceToNow(new Date(createdAt), {addSuffix: true})}</p>
                <p className={"text-muted-foreground"}>#{id.toString()}</p>
            </div>
            <SafeMarkdown text={text}/>
        </div>
    );


}
const NewPostTextbox: FC<{
    creator: string,
    bondingCurveId: string,
    refetchPosts: KeyedMutator<PostFromRestAPI[]>
}> = ({creator, bondingCurveId}) => {
    const account = useCurrentAccount()
    const axios = useContextSelector(AppConfigContext, (v) => v.axios);
    const {register, handleSubmit, watch, reset} = useForm<{ text: string }>({
        defaultValues: {
            text: ""
        }
    });
    const {mutate: signPost} = useSignPersonalMessage()
    if (!account) {
        return <ConnectButton connectText={"Connect wallet to reply"}/>
    }

    const submitPost = async (data: any) => {
        console.log("Submitting post with the following form data: ", data)
        signPost(
            {
                message: new TextEncoder().encode(data.text),
            },
            {
                onSuccess: async (signature) => {
                    console.log("signature", signature)
                    const postData: ThreadPostRequest = {
                        signature: signature.signature,
                        coinId: bondingCurveId,
                        text: data.text,
                        author: account.address
                    }
                    console.log("postData", postData)
                    const thread = await coinRestApi.postThread({axios, post: postData})
                    console.log("threadResponse", thread)
                    reset({text: ""});
                    // await refetchPosts()
                },
            },
        );
    }

    return <form onSubmit={handleSubmit(submitPost)} className={"min-w-[450px]"}>

        <div>
            <Textarea {...register("text", {required: true})} placeholder="Type your message here. Supports markdown."/>
        </div>
        <div className={"flex mt-2 gap-4 justify-center"}>
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

export const CoinThread: FC<{ bondingCurveId: string, creator: string }> = ({
                                                                                creator,
                                                                                bondingCurveId,
                                                                            }) => {
    const {axios, socket, longInterval} = useContextSelector(AppConfigContext, (v) => ({
        axios: v.axios,
        socket: v.socket,
        longInterval: v.longInterval
    }));
    const {
        data: posts,
        error: postsError,
        mutate: refetchPosts
    } = useSWR<PostFromRestAPI[], any, CoinGetPostsKey>({
        axios,
        bondingCurveId,
        path: "getPosts"
    }, coinRestApi.getPosts, {refreshInterval: longInterval});

    useEffect(() => {
            console.log('posts in ws', posts)
            socket.on('connect', () => {
                console.log('listening for new posts');
            });


            socket.on('postCreated', async (data) => {
                console.log('new posts created', data)
                const newPosts = [data, ...posts || []]
                await refetchPosts(newPosts, false)
            });


            socket.on('disconnect', () => {
                console.log('stopped listening for new posts');
            });

            return () => {
                socket.off('connect');
                socket.off('postCreated');
                socket.off('disconnect');
            };
        }, [posts, refetchPosts, socket]
    );

    if (!posts) {
        return <div>Loading posts...</div>
    }
    if (postsError) {
        return <div>Error loading posts {postsError}</div>
    }


    return (
        <div className={"space-y-3"}>
            <div className={"flex justify-center"}>
                <NewPostTextbox creator={creator} bondingCurveId={bondingCurveId} refetchPosts={refetchPosts}/>
            </div>
            {posts.map((post) => (
                <Post key={post.id} creator={creator} {...post}/>
            ))}
        </div>
    );
}