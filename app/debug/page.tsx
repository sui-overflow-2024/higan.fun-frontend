'use client';
import {useFetchManyCoinsFromRest} from "@/hooks/useFetchManyCoinsFromRest";
import 'react-json-pretty/themes/monikai.css';

import JSONPretty from "react-json-pretty";
import {useFetchCoinFromRest} from "@/hooks/useFetchCoinFromRest";
import {FC} from "react";

const DemoSingleCoin: FC<{ packageId: string }> = ({packageId}) => {
    const {data, isLoading, isError, error} = useFetchCoinFromRest({packageId})

    // useFetchManyCoinsFromRest with packageIds filter on the packageId param
    const {
        data: data2,
        isLoading: isLoading2,
        isError: isError2,
        error: error2
    } = useFetchManyCoinsFromRest({packageIds: [packageId]})

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {(error as Error).message}</div>

    return <div>
        <p className={"text-xl bg-white"}>Single Coin {packageId}</p>
        <JSONPretty data={data || {}}/>
        <p className={"text-xl bg-white"}>Filter many with filter on {packageId}</p>
        <JSONPretty data={data2 || {}}/>
    </div>
}

export default function DebugPage() {
    const {data, isLoading, isError, error} = useFetchManyCoinsFromRest({})
    console.log("rest coins data:", data)
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {(error as Error).message}</div>
    return (<div>
        <p className={"text-xl bg-white"}>All Coins</p>
        <JSONPretty data={data || {}}/>
        {data?.map((coin) => <DemoSingleCoin key={coin.packageId} packageId={coin.packageId}/>)}
    </div>)

}