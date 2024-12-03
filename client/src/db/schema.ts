import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const User = pgTable("users", {
  id: integer().primaryKey(),
  username: text().notNull().unique(),
  password: text().notNull(),
  solWalletId: integer(), // optional
  inrWalletId: integer(), // optional
});

export const SolWallet = pgTable("sol_wallets", {
  id: integer().primaryKey(),
  publicKey: text().notNull().unique(),
  privateKey: text().notNull(),
  userId: integer()
    .references(() => User.id)
    .unique(), // one wallet per user
});

export const InrWallet = pgTable("inr_wallets", {
  id: integer().primaryKey(),
  inr: integer().default(0),
  userId: integer()
    .references(() => User.id)
    .unique(), // one wallet per user
});
