"use server";

import { eq, sql } from "drizzle-orm";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  whitelistedUsers
} from "./schema";
import { db } from "./internal";
import { ChoreWithQueue } from "@/types/types";

/**
 * Get all chores from the database.
 */
export async function getChores() {
  const query = sql`
    WITH n AS (
      SELECT * FROM ${choreUserTable} AS cu
      JOIN ${whitelistedUsers} AS u ON cu.user_id = u.id
    )
    SELECT c.*, array_agg(n.name ORDER BY n.time_enqueued) AS queue
    FROM ${choresTable} AS c
    LEFT JOIN n ON c.id = n.chore_id
    GROUP BY c.id
  `;

  return (await db.execute(query)) as unknown as ChoreWithQueue[];
}

/**
 * Get all logs for a specific chore by its ID.
 */
export async function getLogsForChore(choreId: string) {
  return await db
    .select()
    .from(choreLogTable)
    .where(eq(choreLogTable.chore_id, choreId));
}

/**
 * Get all users from the database.
 */
export async function getWhitelistedPeople() {
  return await db
    .select({
      id: whitelistedUsers.id,
      name: whitelistedUsers.name
    })
    .from(whitelistedUsers);
}
