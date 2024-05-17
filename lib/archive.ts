// const {data: data5} = useSuiClientQuery('getCoinMetadata', {
//     coinType: "0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8::coin_example::COIN_EXAMPLE"
// });

//
// import {useSuiClientMutation, useSuiClientQuery} from "@mysten/dapp-kit";
//
// const {
//     data: data4,
//     isPending: isPending2,
//     error: error2,
//     refetch: refetch2
// } = useSuiClientQuery('getDynamicFields', {
//     parentId: baseToken.packageId,
// })
//
// // const {data: data4, isPending: isPending2, error: error2, refetch: refetch2} = useSuiClientQuery('getDynamicFields', {
// //     parentId: baseToken.packageId,
// // })
//
// const {mutate} = useSuiClientMutation('dryRunTransactionBlock');
//
// // console.log("Data3 is", data3)
// console.log("Data4 is", data4)
// // const {data: supply, error} = useSuiClientQuery("getTotalSupply", {
// //     coinType: `0x2::coin::TreasuryCap<0xd22ca9c37f98e8594a832c7355e6070cfb3c21982e9e12d863be067df8a953e8::coin_example::COIN_EXAMPLE>`,
// //     // coinType: getCoinPath(baseToken),
// // })

//
// const dryRunRes = await suiClient.dryRunTransactionBlock({
//     transactionBlock: await txb.build({
//         client: suiClient,
//     }),
// })
// console.log("dryRunRes", dryRunRes)
// // const b = mutate({
// //     transactionBlock: await txb.build(),
// // })
// // console.log("Mutate result", b)



// import {useSuiClientQuery} from "@mysten/dapp-kit";
// import {getCoinPath} from "@/lib/utils";
//
// const {data} = useSuiClientQuery('getCoins', {
//     owner: currentAccount?.address || "",
//     coinType: getCoinPath(baseToken)
// });
//
// const {data: data2} = useSuiClientQuery('getAllBalances', {
//     owner: currentAccount?.address || "",
// });
//
//
// console.log("getCoins", data)
// console.log("getAllBalances", data2)
//

//
// const {data: capRaw} = useSuiClientQuery("getObject", {
//     id: `0x2::coin::TreasuryCap<${getCoinPath(baseToken)}>`,
//     options: {
//         showDisplay: true,
//         showContent: true,
//     }
// })
//
//
// console.log("Get raw store", storeRaw)
// console.log("Get raw cap", capRaw)

// const {data: data3, isPending, error, refetch} = useSuiClientQuery('getDynamicFieldObject', {
//     parentId: baseToken.packageId,
// })
