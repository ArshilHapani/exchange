import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", [
  "google" /** More can be added here in future */,
]);

export const User = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  solWalletId: integer("solWalletId"), // optional
  inrWalletId: integer("inrWalletId"), // optional
  provider: providerEnum().notNull(),
  password: text("password"), // optional
});

export const solWalletRelation = relations(User, ({ one }) => ({
  SolWallet: one(SolWallet),
}));

export const inrWalletRelation = relations(User, ({ one }) => ({
  InrWallet: one(InrWallet),
}));

export const SolWallet = pgTable("sol_wallets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  publicKey: text().notNull().unique(),
  privateKey: text().notNull(),
  userId: integer()
    .references(() => User.id)
    .unique(), // one wallet per user
});

export const InrWallet = pgTable("inr_wallets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  inr: integer().default(0),
  userId: integer()
    .references(() => User.id)
    .unique(), // one wallet per user
});
