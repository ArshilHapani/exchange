CREATE TYPE "public"."provider" AS ENUM('google');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" "provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password" text;