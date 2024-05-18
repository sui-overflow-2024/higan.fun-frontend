'use client';
import {useFetchManyCoinsFromRest} from "@/hooks/useFetchManyCoinsFromRest";
import 'react-json-pretty/themes/monikai.css';

import JSONPretty from "react-json-pretty";


export default function DebugPage() {
    const {data, isLoading, isError, error} = useFetchManyCoinsFromRest({})
    console.log("rest coins data:", data)
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {(error as Error).message}</div>
    return (<div>
        <p className={"text-xl bg-white"}>All Coins</p>
        <JSONPretty data={data || {}}/>
    </div>)

}