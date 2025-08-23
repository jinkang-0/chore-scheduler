"use server";

import { db } from "../lib/config/db";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  whitelistedUsers
} from "../lib/schema";
import { ChoreWithLogs, ChoreWithQueue } from "@/types/types";
import { sql } from "drizzle-orm";

/**
 * Get all chores from the database.
 */
export async function getChores(options?: { dueToday?: boolean }) {
  const query = sql`
    WITH n AS (
      SELECT * FROM ${choreUserTable} AS cu
      JOIN ${whitelistedUsers} AS u ON cu.user_id = u.id
    )
    SELECT c.*, json_agg(json_build_object('name', n.name, 'id', n.id, 'email', n.email) ORDER BY n.time_enqueued) AS queue
    FROM ${choresTable} AS c
    LEFT JOIN n ON c.id = n.chore_id
    GROUP BY c.id
    ${options?.dueToday ? sql`HAVING c.due_date < NOW()` : sql``}
  `;

  return (await db.execute(query)) as unknown as ChoreWithQueue[];
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

/**
 * Get all logs
 */
export async function getAllLogs() {
  const query = sql`
    SELECT
      c.id,
      c.title,
      c.emoji,
      json_agg(json_build_object(
        'id', cl.id, 
        'user_id', cl.user_id,
        'timestamp', cl.timestamp,
        'message', cl.message,
        'type', cl.type
      ) ORDER BY cl.timestamp DESC) AS logs
    FROM ${choresTable} AS c
    LEFT JOIN ${choreLogTable} AS cl ON c.id = cl.chore_id
    GROUP BY c.id
  `;

  return (await db.execute(query)) as unknown as ChoreWithLogs[];
}
