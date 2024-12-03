CREATE TABLE IF NOT EXISTS "inr_wallets" (
	"id" integer PRIMARY KEY NOT NULL,
	"inr" integer DEFAULT 0,
	"userId" integer,
	CONSTRAINT "inr_wallets_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sol_wallets" (
	"id" integer PRIMARY KEY NOT NULL,
	"publicKey" text NOT NULL,
	"privateKey" text NOT NULL,
	"userId" integer,
	CONSTRAINT "sol_wallets_publicKey_unique" UNIQUE("publicKey"),
	CONSTRAINT "sol_wallets_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"solWalletId" integer,
	"inrWalletId" integer,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inr_wallets" ADD CONSTRAINT "inr_wallets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sol_wallets" ADD CONSTRAINT "sol_wallets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
