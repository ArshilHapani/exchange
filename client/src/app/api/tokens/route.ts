import {
  getAssociatedTokenAddress,
  getAccount,
  getMint,
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

import { connection, getSupportedTokens, mode } from "@/lib/constants";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url);
    const userAddress = params.searchParams.get("address") ?? "";
    if (userAddress === "") {
      return NextResponse.json({
        status: 400,
        body: {
          message: "Address not provided",
        },
      });
    }

    const supportTokens = await getSupportedTokens();

    const balances = await Promise.all(
      supportTokens.map((token) => getAccountBalance(token, userAddress))
    );

    return NextResponse.json({
      balance: balances,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      status: false,
      message: e.message,
    });
  }
}

type TokenType = Awaited<ReturnType<typeof getSupportedTokens>>[0];

async function getAccountBalance(token: TokenType, address: string) {
  try {
    const mint = token[mode === "devnet" ? "devNet" : "mint"];
    if (token.native) {
      const balance = await connection.getBalance(new PublicKey(address));
      return {
        token: token.name,
        balance: balance * LAMPORTS_PER_SOL,
      };
    }
    const ata = await getAssociatedTokenAddress(
      new PublicKey(mint),
      new PublicKey(address)
    );
    const account = await getAccount(connection, ata);
    const mintDetail = await getMint(connection, new PublicKey(mint));
    const balance = Number(account.amount) / 10 ** mintDetail.decimals;
    return {
      token: token.name,
      balance,
    };
  } catch (e) {
    console.log(e);
    return {
      token: token.name,
      balance: 0,
    };
  }
}
