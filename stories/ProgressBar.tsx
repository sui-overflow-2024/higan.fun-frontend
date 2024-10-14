import React, {FC} from 'react';
import {animated, useSpring} from "@react-spring/web";

interface ProgressBarProps {
    progress: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({progress}) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    const springs = useSpring({
        from: {width: '0%'},
        to: {width: `${clampedProgress}%`},

    });


    if (process.env.NODE_ENV === 'development' && progress !== clampedProgress) {
        console.warn(`ProgressBar: progress value ${progress} was clamped to ${clampedProgress}`);
    }

    return (
        <div
            className="w-full bg-gray-700 rounded-full h-4"
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <animated.div
                className="bg-green-500 h-4 rounded-full"
                style={springs}
            />
        </div>
    );
};