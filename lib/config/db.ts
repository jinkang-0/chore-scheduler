import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Did you export db in the client code?"
  );
}

const client = postgres(process.env.DATABASE_URL, { prepare: false });

/**
 * Drizzle ORM database instance for PostgreSQL.
 * Not meant to be used directly in the frontend.
 * Use other exported functions for database operations.
 */
export const db = drizzle({ client });
