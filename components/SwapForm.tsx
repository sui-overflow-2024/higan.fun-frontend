import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import {useEffect, useState} from "react";
import {CoinFromRestAPI, CoinStatus} from "@/lib/types";
import type {CoinStruct, SuiClient} from '@mysten/sui.js/client';
import {SubmitHandler, useForm} from "react-hook-form";
import {useTransactionExecution} from "@/hooks/useTransactionexecution";
import {AppConfigContext} from "@/components/Contexts";
import {ConnectButton, useCurrentAccount} from "@mysten/dapp-kit";
import {TransactionBlock} from "@mysten/sui.js/transactions";
import {
  getAllUserCoins,
  getExactCoinByAmount,
  swap
} from "@/lib/kriya";
import JSONPretty from "react-json-pretty";
import {useContextSelector} from "use-context-selector";
import {getCoinTypePath, getManagerFuncPath, getValueWithDecimals, truncateDecimals} from "@/lib/utils";


export type SwapFormArgs = {
  inputCoinAmount: number,
  minReceived: bigint,
}

export const SwapForm: React.FC<{
  token: CoinFromRestAPI,
  suiClient: SuiClient
}> = ({token, suiClient}) => {
  const account = useCurrentAccount();
  const executeTranscation = useTransactionExecution()
  const kriyaPackageId = useContextSelector(AppConfigContext, (v) => v.kriyaPackageId);
  const currentAccount = useCurrentAccount()
  const [userBalance, setUserBalance] = useState(0)
  const [userSuiBalance, setUserSuiBalance] = useState(0)
  const [baseCoins, setBaseCoins] = useState<CoinStruct[]>([])
  const [res, setRes] = useState<any>(null)
  const sign = useTransactionExecution();
  const [mode, setMode] = useState<"buy" | "sell">("buy")

  let pool = {
    objectId: token.poolId, //rest api
    tokenXType: getCoinTypePath(token), //getCoinTypePath(restApiToken) packageId::module::MODULE
    tokenYType: `0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI`,
    isStable: false,
}
  const {register, handleSubmit, watch, formState: {errors}, reset} = useForm<SwapFormArgs>({
      defaultValues: {
          inputCoinAmount: 1,
          minReceived: BigInt(0),
      }
  });

  const multiplier = mode == "buy" ? Math.pow(10, 9) : (token?.decimals || 0) > 0 ? Math.pow(10, token?.decimals || 0) : 1
  const amount = BigInt(watch("inputCoinAmount") * multiplier)
  console.log("amount", amount)

  useEffect(() => {
    const fetchBalance = async () => {
        if (!token) return
        if (!currentAccount?.address) return
        if (!suiClient) return

        const balance = await suiClient.getBalance({
            owner: currentAccount.address,
            coinType: getCoinTypePath(token),
        })

        console.log(balance, "balance");

        const suiBalance = await suiClient.getBalance({
            owner: currentAccount.address,
        });

        setUserSuiBalance(parseInt(suiBalance.totalBalance || "0"));
        setUserBalance(parseInt(balance.totalBalance))

        const coins = await getAllUserCoins({
            suiClient: suiClient,
            type: getCoinTypePath(token),
            address: currentAccount.address,
        });

        setBaseCoins(coins)
    }
    fetchBalance()
}, [token, currentAccount?.address, suiClient, userBalance, userSuiBalance])

  // Transaction failed with the following error. Error checking transaction input objects: MovePackageAsObject { object_id: 0x0000000000000000000000000000000000000000000000000000000000000002 }
  let inputCoinX = mode == "buy" ? "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI" : getCoinTypePath(token)

  const onSubmit: SubmitHandler<SwapFormArgs> = async (data) => {
      console.log("data", data)
      // Handle the form data submission
      console.log(data);
      const txb = new TransactionBlock();
      // const pool = await getLiquidityPoolFields(suiClientCtx, data.pool.objectId,/* data.pool.tokenXType, data.pool.tokenYType*/)
      const allCoinX = await getAllUserCoins({
          suiClient: suiClient,
          address: account?.address || "",
          type: inputCoinX
      })
      const inputCoin = getExactCoinByAmount(inputCoinX, allCoinX, amount, txb)

      swap({
          kriyaPackageId,
          pool,
          inputCoinType: inputCoinX, //buy? SUI, sell: CustomToken
          inputCoinAmount: amount, // Amount user puts into the form
          inputCoin: inputCoin, // getAllUserCoins -> getExactCoinByAmount
          minReceived: BigInt(0), // 0.97 * inputCoinAmount
          txb,
          transferToAddress: account?.address || "",

      });

      await executeTranscation(txb)

      setRes(res)
  };

  return (<Card>
      <CardHeader>
          <div className={"flex justify-between"}>
              <Button
                  className={"w-36"}
                  variant={mode === "buy" ? "default" : "outline"}
                  onClick={() => {setMode("buy"); reset()}}>
                  Buy
              </Button>

              <Button
                  className={"w-36"}
                  variant={mode === "sell" ? "default" : "outline"}
                  onClick={() => {setMode("sell"); reset();}}
                  disabled={userBalance === 0}
              >
                  Sell
              </Button>
          </div>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                  <label>Input Coin Amount:</label>
                  <input type="number" {...register('inputCoinAmount', {required: true})}
                  />
                  {errors.inputCoinAmount && <span>This field is required</span>}
              </div>
              <div>
                  <label>Minimum Received:</label>
                  <input type="number" {...register('minReceived', {required: true})}
                  />
                  {errors.minReceived && <span>This field is required</span>}
              </div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
          </form>
          <JSONPretty data={res || {}}/>
          <JSONPretty data={pool}/>
      </CardContent>
    </Card>
  );
};

