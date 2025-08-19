import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_PUSH_URL) {
  throw new Error("DATABASE_PUSH_URL environment variable is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./api/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_PUSH_URL!
  },
  verbose: true,
  strict: true
});
