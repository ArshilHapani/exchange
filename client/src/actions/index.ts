"use server";

import { InrWallet } from "@/db/schema";
import db from "@/lib/drizzle";
import { eq, sql } from "drizzle-orm";

export async function addBalance({
  amount,
  userId,
}: {
  amount: number;
  userId: number;
}) {
  try {
    await db
      .update(InrWallet)
      .set({ inr: sql`${InrWallet.inr} + ${amount}` })
      .where(eq(InrWallet.userId, userId));
    return true;
  } catch {
    return false;
  }
}
