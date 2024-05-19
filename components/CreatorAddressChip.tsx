import React, {FC} from "react";
import Link from "next/link";
import Jazzicon, {jsNumberForAddress} from "react-jazzicon";
import {addressToBackgroundColor} from "@/lib/utils";


type CreatorAddressChipProps = {
    address: string;
    showAvatar?: boolean;
    avatarImageUrl?: string;
    variant?: "small" | "default";
}
export const CreatorAddressChip: FC<CreatorAddressChipProps> = ({address, showAvatar, avatarImageUrl, variant = "default"}) => {
    let avatar = <Jazzicon diameter={variant === "small" ? 16 : 24} seed={jsNumberForAddress(address)}/>
    if(avatarImageUrl) {
       avatar = variant === "small"
           ? <img src={avatarImageUrl} alt={"avatar"} className="w-4 h-4 rounded-full"/>
           : <img src={avatarImageUrl} alt={"avatar"} className="w-6 h-6 rounded-full"/>
    }

    if (variant === "small") return (
        <Link href={`/profile/${address}`} className="flex items-center space-x-1 text-xs">
            {showAvatar && avatar}
            <span className="font-mono px-1 py-0.5 rounded"
                  style={{backgroundColor: addressToBackgroundColor(address)}}>
                {address.slice(2, 8)}
            </span>
        </Link>
    )
    return <Link href={`/profile/${address}`} className="flex items-center space-x-1">
        {showAvatar && avatar}
        <span className="px-2 py-1 rounded font-mono"
              style={{backgroundColor: addressToBackgroundColor(address)}}>
                                {address.slice(2, 8)}
        </span>
    </Link>
}