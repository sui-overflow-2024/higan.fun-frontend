import {ComponentProps, FC} from 'react';
import Image from 'next/image';

type SocialIconProps = {
    link: string;
    iconSrc: ComponentProps<typeof Image>['src'];
    alt: string;
}


export const SocialIcon: FC<SocialIconProps> = ({link, iconSrc, alt}) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block magnify-on-hover"
        >
            <Image
                src={iconSrc}
                alt={alt}
                width={30}
                height={30}
                className="w-30 h-30" // This allows the image to scale properly
            />
        </a>
    );
};