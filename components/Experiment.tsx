import {FC, useState} from "react";
import {useSuiClient, useSuiClientQuery} from "@mysten/dapp-kit";

const TokenLookup: FC<{ id: string }> = ({id}) => {
    const suiClient = useSuiClient();
    const {data, refetch} = useSuiClientQuery("getObject", {
        id: id,
        options: {
            showContent: true,
        }
    })

    console.log("Data", data)
    if (!data?.data) return <div>Not found</div>;

    console.log(data.data)

    return (<div>
            {}
        </div>

    )
}

export const Experiment: FC = () => {
    const [id, setId] = useState("1")

    return (
        <div>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)}/>
            <TokenLookup id={id}/>
        </div>
    )
}