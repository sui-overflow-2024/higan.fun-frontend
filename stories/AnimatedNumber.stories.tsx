import type {Meta, StoryObj} from '@storybook/react';
import {useEffect, useState} from "@storybook/preview-api";
import {AnimatedNumber} from "@/stories/AnimatedNumber";


const meta: Meta<typeof AnimatedNumber> = {
    title: "Generic/AnimatedNumber",
    component: AnimatedNumber
};

export default meta


type Story = StoryObj<typeof meta>;


export const Default: Story = {
    args: {
        value: 1000,
        intlProps: {
            style: "decimal",
        }
    }
};
export const Currency: Story = {
    args: {
        ...Default.args,
        intlProps: {
            style: "currency",
        }
    }
};
export const Percent: Story = {
    args: {
        ...Default.args,
        intlProps: {
            style: "percent",
        }
    }
};

export const AnimatedNumberCycleAnimation: Story = {
    args: {
        ...Default.args,
    },
    render: () => {
        const [value, setValue] = useState(10000);

        useEffect(() => {
            const randomIncrement = Math.floor(Math.random() * 1000000);

            const timer = setTimeout(() => {
                setValue(randomIncrement);
            }, 500);

            return () => clearTimeout(timer);
        }, [value]);

        return <div>
            <div>
                <AnimatedNumber value={value}/>
            </div>
            <div>
                <AnimatedNumber value={value} intlProps={{style: "percent"}}/>
            </div>
            <div>
                <AnimatedNumber value={value} intlProps={{style: "currency"}}/>
            </div>
        </div>
    }
};
