import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

import { connection, getSupportedTokens, mode } from "@/lib/constants";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url);
    const userAddress = params.searchParams.get("address") ?? "";
    if (userAddress === "") {
      return NextResponse.json({
        message: "Address not provided",
        data: null,
        success: false,
      });
    }

    const supportTokens = await getSupportedTokens();

    const balances = await Promise.all(
      supportTokens.map((token) => getAccountBalance(token, userAddress))
    );
    const totalBalance = balances.reduce(
      (acc, nxt) => acc + nxt.balanceInUSD,
      0
    );
    return NextResponse.json({
      data: {
        totalBalance: totalBalance,
        balance: balances,
      },
      success: true,
      message: "Tokens fetched!",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      status: false,
      message: e.message ?? "failed to fetch balance",
      data: null,
    });
  }
}

type TokenType = Awaited<ReturnType<typeof getSupportedTokens>>[0];

async function getAccountBalance(
  token: TokenType,
  address: string
): Promise<{
  token: string;
  balanceInUSD: number;
  balance: number;
  price: number;
  address: string;
  decimals: number;
}> {
  try {
    const mint = token[mode === "devnet" ? "devNet" : "mint"];
    if (token.native) {
      const balance = await connection.getBalance(new PublicKey(address));
      return {
        token: token.name,
        balanceInUSD: (balance / LAMPORTS_PER_SOL) * token.price,
        balance: balance / LAMPORTS_PER_SOL,
        price: token.price,
        address: token.mint,
        decimals: token.decimals,
      };
    }
    const ata = await getAssociatedTokenAddress(
      new PublicKey(mint),
      new PublicKey(address)
    );
    const account = await getAccount(connection, ata);
    const balance = Number(account.amount) / 10 ** token.decimals;
    return {
      token: token.name,
      balance,
      balanceInUSD: balance,
      price: token.price,
      address: token.mint,
      decimals: token.decimals,
    };
  } catch {
    return {
      token: token.name,
      balance: 0,
      balanceInUSD: 0,
      price: token.price,
      address: token.mint,
      decimals: token.decimals,
    };
  }
}
