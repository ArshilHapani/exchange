import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

import { connection, mode, SUPPORTED_TOKENS } from "@/lib/constants";

export async function GET(req: Request) {
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

  const balances = await Promise.all(
    SUPPORTED_TOKENS.map(async function (token) {
      const eta = await getAssociatedTokenAddress(
        new PublicKey(token[mode === "devnet" ? "devNet" : "mint"]),
        new PublicKey(userAddress)
      );
      const acc = await getAccount(connection, eta);
      return {
        token: token.name,
        balance: acc.amount,
      };
    })
  );

  return NextResponse.json({
    balance: balances,
  });
}
