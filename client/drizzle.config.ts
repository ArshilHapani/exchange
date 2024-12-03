import { defineConfig } from "drizzle-kit";

// important docs: https://orm.drizzle.team/docs/tutorials/drizzle-nextjs-neon
// timestamp: 1:41:20

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: true,
  },
});
