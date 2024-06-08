// Significant portions of this code is copied from kriya-dex-sdk
// We copied it out of the package so we could modify it immediately without creating a fork
import {Dex,} from "kriya-dex-sdk";
import 'react-json-pretty/themes/monikai.css';
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";
import {CoinStruct, SuiClient} from "@mysten/sui.js/client";
import {WalletAccount} from "@wallet-standard/base";
import {DexConstants} from "kriya-dex-sdk/dist/constants";

export type Pool = {
    objectId: string,
    tokenXType: string,
    tokenYType: string,
    isStable?: boolean,
}
type AddLiquidityArgs = {
    kriyaPackageId: string,
    account?: WalletAccount | null,
    suiClient: SuiClient,
    pool: Pool,
    amountX: bigint,
    amountY: bigint,
    minAddAmountX: bigint,
    minAddAmountY: bigint,
    // coinX: string | TransactionArgument,
    // coinY: string | TransactionArgument,
    txb: TransactionBlock,
    transferToAddress?: string
}

export const addLiquidity = async ({
                                       kriyaPackageId,
                                       account,
                                       suiClient,
                                       pool,
                                       amountX,
                                       amountY,
                                       minAddAmountX = BigInt(0),
                                       minAddAmountY = BigInt(0),
                                       // coinX,
                                       // coinY,
                                       txb,
                                       transferToAddress,
                                   }: AddLiquidityArgs): Promise<TransactionArgument | undefined> => {


    const xCoins = await getAllUserCoins({
        suiClient: suiClient,
        type: pool.tokenXType,
        address: account?.address || "",
    });
    const yCoins = await getAllUserCoins({
        suiClient: suiClient,
        type: pool.tokenYType,
        address: account?.address || "",
    });


    const coinXSplit = getExactCoinByAmount(pool.tokenXType, xCoins, amountX, txb)
    const coinYSplit = getExactCoinByAmount(pool.tokenYType, yCoins, amountY, txb)

    const [lpObject] = txb.moveCall({
        target: `${kriyaPackageId}::spot_dex::add_liquidity`,
        typeArguments: [pool.tokenXType, pool.tokenYType],
        // typeArguments: ["0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO", "0x2::sui::SUI"],
        arguments: [
            // txb.object("0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e"),
            txb.object(pool.objectId),
            // txb.object("0x056ff64eef35207d845c2b954295ae4c2bfa65f23de53a58d9c2a961e1bcf396"),
            // typeof (coinY) == 'string' ? txb.object(coinY) : coinY,
            txb.object(coinYSplit),
            // txb.object("0x75f3dcade20d5acc23725c40191e03e7bdfe14a62e42d472dd8bee9006224e16"),
            txb.object(coinXSplit),
            // typeof (coinX) == 'string' ? txb.object(coinX) : coinX,
            txb.pure(amountY),
            txb.pure(amountX),
            txb.pure(minAddAmountX),
            txb.pure(minAddAmountY),
        ],
    });

    if (Boolean(transferToAddress)) {
        txb.transferObjects([lpObject], txb.pure(transferToAddress));
    } else {
        return lpObject;
    }
};
// Transaction failed with the following error. Dry run failed, could not automatically determine a budget: MoveAbort(MoveLocation { module: ModuleId { address: b5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd, name: Identifier("spot_dex") }, function: 27, instruction: 63, function_name: Some("get_amount_for_add_liquidity") }, 5) in command 2
//
// export const addLiquiditySingleSided = async (
//     kriyaPackageId: string,
//     account: WalletAccount,
//     suiClient: SuiClient,
//     pool: Pool,
//     inputCoinType: string,
//     inputCoinAmount: bigint,
//     inputCoin: string | TransactionArgument,
//     swapSlippageTolerance: number,
//     txb: TransactionBlock,
//     transferToAddress?: string
// ): Promise<TransactionArgument | null> => {
//     if (swapSlippageTolerance > 1 || swapSlippageTolerance < 0)
//         swapSlippageTolerance = 0.9; // set sane default if bad value provided
//
//     const isXtoY = pool.tokenXType === inputCoinType;
//     const amountToSwap = await getOptimalLpSwapAmount(inputCoinAmount, pool.objectId, isXtoY, txb, pool?.isStable)
//
//     const coinToSwap = txb.splitCoins(
//         // @ts-ignore
//         typeof (inputCoin) == 'string' ? txb.object(inputCoin) : inputCoin,
//         [
//             typeof (amountToSwap) == "bigint" ? txb.pure(amountToSwap) : amountToSwap
//         ]);
//
//     const swappedCoin = swap(pool, inputCoinType, amountToSwap, coinToSwap, BigInt(0), txb);
//     const coinX = isXtoY ? inputCoin : swappedCoin;
//     const coinY = isXtoY ? swappedCoin : inputCoin;
//     const coinXAmount = getCoinValue(pool.tokenXType, coinX, txb);
//     const coinYAmount = getCoinValue(pool.tokenYType, coinY, txb);
//
//     return addLiquidity({
//         kriyaPackageId,
//         account,
//         suiClient,
//         pool,
//         coinXAmount,
//         coinYAmount,
//         minAddAmountX: BigInt(0),
//         minAddAmountY: BigInt(0),
//         coinX,
//         coinY,
//         txb,
//         transferToAddress
//     });
// };

export const removeLiquidity = (
    pool: Pool,
    amount: bigint | TransactionArgument,
    kriyaLpToken: string | TransactionArgument,
    txb: TransactionBlock,
    transferToAddress?: string
): Array<TransactionArgument> | undefined => {
    const txRes = txb.moveCall({
        target: `0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::remove_liquidity`,
        typeArguments: [pool.tokenXType, pool.tokenYType],
        arguments: [
            txb.object(pool.objectId),
            typeof (kriyaLpToken) == 'string' ? txb.object(kriyaLpToken) : kriyaLpToken,
            typeof (amount) == 'bigint' ? txb.pure(amount) : amount,
        ],
    });

    if (Boolean(transferToAddress)) {
        txb.transferObjects([txRes[0]], txb.pure(transferToAddress));
        txb.transferObjects([txRes[1]], txb.pure(transferToAddress));
    } else {
        return txRes;
    }
};

export const getOptimalLpSwapAmount = async (inputAmt: bigint, poolId: string, isXtoY: boolean, txb: TransactionBlock, isStable?: boolean): Promise<bigint | TransactionArgument> => {
    const dex = new Dex("https://fullnode.mainnet.sui.io:443")
    const txn = await dex.suiClient.getObject({
        id: poolId,
        options: {showContent: true},
    });
    // @ts-ignore
    const tokenReserve = isXtoY ? Number(txn.data?.content.fields.token_x) : Number(txn.data?.content.fields.token_y);

    if (!isStable && tokenReserve) {
        const swapAmt = (babylonianSqrt(tokenReserve * ((tokenReserve * 3992004) + (Number(inputAmt) * 3992000))) - (tokenReserve * 1998)) / 1996;
        return BigInt(Math.round(swapAmt));

    } else {
        const swapAmtStable = calculateStableSwapAmount(Number(inputAmt), Number((txn.data?.content as any).fields.token_x), Number((txn.data?.content as any).fields.token_y), isXtoY);
        return BigInt(Math.round(swapAmtStable));
    }

}

export const babylonianSqrt = (y: number): number => {
    let x: number, z: number
    if (y > 3) {
        z = y;
        x = y / 2 + 1;
        while (x < z) {
            z = x;
            x = (y / x + x) / 2;
        }
        return z;
    } else if (y != 0) {
        z = 1;
        return z;
    }
    return -1
}

export const calculateStableSwapAmount = (totalAmount: number, tokenXReserve: number, tokenYReserve: number, isX: boolean): number => {
    const ratio = tokenXReserve / tokenYReserve;
    let swapAmount: number;

    if (!isX) {
        swapAmount = totalAmount / (1 + 1 / ratio);
    } else {
        swapAmount = totalAmount - (totalAmount / (1 + 1 / ratio));
    }

    return swapAmount;
}


// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
export const getAllUserCoins = async ({
                                          suiClient,
                                          address,
                                          type,
                                      }: {
    suiClient: SuiClient;
    type: string;
    address: string;
}): Promise<CoinStruct[]> => {
    let cursor: string | null | undefined = null;

    let coins: CoinStruct[] = [];
    let iter = 0;
    console.log("getAllUserCoins", suiClient, address, type, cursor)
    do {
        try {
            const res = await suiClient.getCoins({
                owner: address,
                coinType: type,
                cursor: cursor,
                limit: 50,
            });
            coins = coins.concat(res.data);
            cursor = res.nextCursor;
            if (!res.hasNextPage || iter === 8) {
                cursor = null;
            }
        } catch (error) {
            console.log(error);
            cursor = null;
        }
        iter++;
    } while (cursor !== null);

    return coins;
};
// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
export const getCoinsGreaterThanAmount = (
    amount: bigint,
    coins: CoinStruct[]
): string[] => {

    const coinsWithBalance: string[] = [];

    let collectedAmount = BigInt(0);

    for (const coin of coins) {
        const balance = BigInt(coin.balance);
        if (
            collectedAmount < amount &&
            !coinsWithBalance.includes(coin.coinObjectId)
        ) {
            coinsWithBalance.push(coin.coinObjectId);
            collectedAmount = collectedAmount + balance;
        }
        if (
            balance === BigInt(0) &&
            !coinsWithBalance.includes(coin.coinObjectId)
        )
            coinsWithBalance.push(coin.coinObjectId);
    }

    if (collectedAmount >= amount) {
        return coinsWithBalance;
    } else {
        throw new Error("Insufficient balance");
    }

}
// Function from: https://www.npmjs.com/package/kriya-dex-sdk?activeTab=code
export const getExactCoinByAmount = (
    coinType: string,
    coins: CoinStruct[],
    amount: bigint,
    txb: TransactionBlock
) => {
    if (coinType === "0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI") {
        const [coinA] = txb.splitCoins(txb.gas, [txb.pure(amount)]);
        return coinA;
    } else {
        const coinsX = getCoinsGreaterThanAmount(amount, coins);

        if (coinsX.length > 1) {
            txb.mergeCoins(
                txb.object(coinsX[0]),
                coinsX.slice(1).map((coin) => txb.object(coin))
            );
        }
        console.log("coinsX", coinsX, coinsX.length, coinsX[0])

        const [coinA] = txb.splitCoins(txb.object(coinsX[0]), [
            txb.pure(amount),
        ]);
        return coinA;
    }
};


export const getCoinValue = (coinType: string, coinObject: string | TransactionArgument, txb: TransactionBlock): TransactionArgument => {
    const inputCoinObject = typeof (coinObject) == 'string' ? txb.object(coinObject) : coinObject;
    let [value] = txb.moveCall({
        target: `0x2::coin::value`,
        typeArguments: [coinType],
        // @ts-ignore
        arguments: [inputCoinObject],
    });
    return value;
}

export const swap = (
    kyriaPackageId: string,
    pool: Pool,
    inputCoinType: string,
    inputCoinAmount: bigint | TransactionArgument,
    inputCoin: string | TransactionArgument,
    minReceived: bigint,
    txb: TransactionBlock,
    transferToAddress?: string
): TransactionArgument | undefined => {
    const isXtoY = pool.tokenXType === inputCoinType;
    const inputCoinObject = typeof (inputCoin) === 'string' ? txb.object(inputCoin) : inputCoin;
    const inputTokenAmount = typeof (inputCoinAmount) === 'bigint' ? txb.pure(inputCoinAmount) : inputCoinAmount;

    const txnResult = txb.moveCall({
        target: `${kyriaPackageId}::spot_dex::${isXtoY ? DexConstants.functions.swapX : DexConstants.functions.swapY}`,
        arguments: [
            txb.object(pool.objectId),
            inputCoinObject,
            inputTokenAmount,
            txb.pure(minReceived),
        ],
        typeArguments: [pool.tokenXType, pool.tokenYType],
    });

    if (Boolean(transferToAddress)) {
        txb.transferObjects([txnResult], txb.pure(transferToAddress));
    } else {
        return txnResult;
    }
}