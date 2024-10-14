import type {Meta, StoryObj} from '@storybook/react';
import {ProgressBar} from "@/stories/ProgressBar";
import {useEffect, useState} from "@storybook/preview-api";


const meta: Meta<typeof ProgressBar> = {
    title: "Generic/ProgressBar",
    component: ProgressBar
};

export default meta


type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        progress: 50,
    }
};

export const Empty: Story = {
    args: {
        ...Default.args,
        progress: 25
    }
};
export const TwentyFive: Story = {
    args: {
        ...Default.args,
        progress: 39
    }
};

export const SeventyFive: Story = {
    args: {
        ...Default.args,
        progress: 75
    }
};

export const Full: Story = {
    args: {
        ...Default.args,
        progress: 100
    }
};

export const OverOneHundred: Story = {
    args: {
        ...Default.args,
        progress: 500
    }
};
export const LessThanZero: Story = {
    args: {
        ...Default.args,
        progress: -100
    }
};

export const AnimatedProgress: Story = {
    args: {
        ...Default.args,
    },
    render: () => {
        const [progress, setProgress] = useState(50);

        useEffect(() => {
            const randomIncrement = Math.floor(Math.random() * 21) - 10;
            const randomInterval = Math.floor(Math.random() * 501) + 300;

            const timer = setTimeout(() => {
                setProgress(prevProgress => {
                    const newProgress = prevProgress + randomIncrement;
                    return newProgress > 100 ? 100 : newProgress; // Cap at 100
                });
            }, randomInterval);

            return () => clearTimeout(timer);
        }, [progress]);

        return <ProgressBar progress={progress}/>;
    }
};
