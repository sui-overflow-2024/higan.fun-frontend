import React, { FC } from 'react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import {CoinPost} from "@/lib/types";
import {CreatorAddressChip} from "@/components/CreatorAddressChip";

const SafeMarkdown: FC<{markdownText: string}> = ({ markdownText }) => {
    const md = new MarkdownIt();
    const sanitizedHTML = DOMPurify.sanitize(md.render(markdownText));

    return (
        <div
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};
const Post: FC<{creator: string, post: CoinPost}> = ({creator, post}) => {
    console.log("post", post)
    console.log("creator", creator)
    return (
        <div className="rounded-sm overflow-hidden bg-gray-800 text-sm p-4 space-y-1 min-w-full">
            <div className={"flex gap-2 text-xs text-muted-foreground"}>
                <CreatorAddressChip address={post.suiAddress} variant={"small"} isCreator={creator !== "" && creator === post.suiAddress}/> <p>{post.createdAt.toLocaleString()}</p> <p>#{post.id}</p>
            </div>
            {/*<img*/}
            {/*    className="w-full"*/}
            {/*    src="path/to/your/image.png"*/}
            {/*    alt="BOD OF WAR"*/}
            {/*/>*/}
                {/*<p className="text-gray-400 text-base">*/}
                {/*    To live in the light, you must kill the darkness. Release this summer ⚔️⚡🔥*/}
                {/*</p>*/}
                <SafeMarkdown markdownText={post.text} />
        </div>
    );
}
export const CoinThread: FC<{creator: string, posts: CoinPost[]}> = ({creator, posts}) => {
console.log("creator", creator)
    return (
        <div className={"space-y-3"}>
            {posts.map((post) => (
                <Post key={post.id} creator={creator} post={post} />
            ))}
        </div>
    );
}