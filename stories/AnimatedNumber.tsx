import React, {FC} from 'react';
import {animated, useSpring} from "@react-spring/web";

interface AnimatedNumberProps {
    value: number;
    fixedDigits?: number;
    intlProps?: Intl.NumberFormatOptions;
}

export const AnimatedNumber: FC<AnimatedNumberProps> = ({
                                                            value,
                                                            fixedDigits = 2,
                                                            intlProps
                                                        }) => {

    const numberString = (n: number | bigint) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: fixedDigits,
            maximumFractionDigits: fixedDigits,
            currency: 'USD',
            ...intlProps
        }).format(n);
    }

    const {number} = useSpring({
        from: {number: 0},
        to: {number: value},
        // delay: 200,
        config: {
            duration: 200,
            mass: 1,
            tension: 20,
            friction: 10
        },
    });


    return <animated.span>
        {number.to((n) => numberString(n))}
    </animated.span>
};
