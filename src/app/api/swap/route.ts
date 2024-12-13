import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { SolWallet, User } from "@/db/schema";
import { connection } from "@/lib/constants";
import db from "@/lib/drizzle";

export async function POST(req: Request) {
  const {
    quoteResponse,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quoteResponse: any;
  } = await req.json();

  const session = await getServerSession();
  if (!session || !session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const solWallet = await db
    .select()
    .from(User)
    .leftJoin(SolWallet, eq(User.id, SolWallet.userId))
    .where(eq(User.email, session.user.email ?? ""));

  if (solWallet.length === 0 || !solWallet[0].sol_wallets?.publicKey) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      {
        status: 404,
      }
    );
  }

  // get serialized transactions for the swap
  const { swapTransaction } = await (
    await fetch("https://quote-api.jup.ag/v6/swap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: solWallet[0].sol_wallets?.publicKey,
        wrapAndUnwrapSol: true,
      }),
    })
  ).json();

  // deserialize the transaction
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

  // sign the transaction
  const privateKey = getPrivateKeyFromString(
    solWallet[0].sol_wallets?.privateKey
  );
  transaction.sign([privateKey]);

  // get the latest block hash
  const latestBlockHash = await connection.getLatestBlockhash();

  // Execute the transaction
  const rawTransaction = transaction.serialize();
  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    maxRetries: 2,
  });
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: txid,
  });

  return NextResponse.json({
    success: true,
    message: "Transaction successful",
    data: {
      txid,
    },
  });
}

function getPrivateKeyFromString(privateKey: string) {
  // it is in [4,56,765....] form
  const arr = new Uint8Array(privateKey.split(",").map(Number));
  return Keypair.fromSecretKey(arr);
}
