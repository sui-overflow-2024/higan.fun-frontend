import useSWR from "swr";
import JSONPretty from 'react-json-pretty'

// @ts-ignore-next-line
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
    const {data, error} = useSWR('/api/coin', fetcher)

    return (<div>
            <h1>Coins</h1>
            <JSONPretty data={data}/>
        </div>)

}