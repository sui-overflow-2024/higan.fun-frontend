// All code here copied from kriya-dex-sdk

import {Dex,} from "kriya-dex-sdk";
import 'react-json-pretty/themes/monikai.css';
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export type Pool = {
    objectId: string,
    tokenXType: string,
    tokenYType: string,
    isStable?: boolean,
}

export const addLiquidity = (
    pool: Pool,
    amountX: bigint,
    amountY: bigint,
    minAddAmountX: bigint,
    minAddAmountY: bigint,
    coinX: string,
    coinY: string,
    txb: TransactionBlock,
    transferToAddress?: string
): TransactionArgument | undefined => {
    const [lpObject] = txb.moveCall({
        target: `0xb5722117aec83525c71f84c31c1f28e29397feffa95c99cce72a150a555a63dd::spot_dex::add_liquidity`,
        typeArguments: ["0x451fe2a80e66bb4453579fe9e4859959234e2c31d9c04c377d9b4d8ff26525cb::tempus_dedico::TEMPUS_DEDICO", "0x2::sui::SUI"],
        arguments: [
            txb.object("0x66150fe520140041937ce9394c2001f5512bc638718913a6fe802ccee9ae666e"),
            txb.object("0x056ff64eef35207d845c2b954295ae4c2bfa65f23de53a58d9c2a961e1bcf396"),
            // typeof (coinY) == 'string' ? txb.object(coinY) : coinY,
            txb.object("0x75f3dcade20d5acc23725c40191e03e7bdfe14a62e42d472dd8bee9006224e16"),
            // typeof (coinX) == 'string' ? txb.object(coinX) : coinX,
            txb.pure(1060005000),
            txb.pure(10_000),
            txb.pure(1060005000),
            txb.pure(10_000),
        ],
    });

    // if (Boolean(transferToAddress)) {
    txb.transferObjects([lpObject], txb.pure(transferToAddress));
    // } else {
    return lpObject;
    // }
};

export const addLiquiditySingleSided = async (
    pool: Pool,
    inputCoinType: string,
    inputCoinAmount: bigint,
    inputCoin: string | TransactionArgument,
    swapSlippageTolerance: number,
    txb: TransactionBlock,
    transferToAddress?: string
): Promise<TransactionArgument | null> => {
    if (swapSlippageTolerance > 1 || swapSlippageTolerance < 0)
        swapSlippageTolerance = 0.9; // set sane default if bad value provided

    const isXtoY = pool.tokenXType === inputCoinType;
    const amountToSwap = await getOptimalLpSwapAmount(inputCoinAmount, pool.objectId, isXtoY, txb, pool?.isStable)

    const coinToSwap = txb.splitCoins(
        // @ts-ignore
        typeof (inputCoin) == 'string' ? txb.object(inputCoin) : inputCoin,
        [
            typeof (amountToSwap) == "bigint" ? txb.pure(amountToSwap) : amountToSwap
        ]);

    const swappedCoin = swap(pool, inputCoinType, amountToSwap, coinToSwap, BigInt(0), txb);
    const coinX = isXtoY ? inputCoin : swappedCoin;
    const coinY = isXtoY ? swappedCoin : inputCoin;
    const coinXAmount = getCoinValue(pool.tokenXType, coinX, txb);
    const coinYAmount = getCoinValue(pool.tokenYType, coinY, txb);

    return addLiquidity(pool, coinXAmount, coinYAmount, BigInt(0), BigInt(0), coinX, coinY, txb, transferToAddress);
};

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



