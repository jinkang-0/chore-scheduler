"use server";

import { sql } from "drizzle-orm";
import type { Chore, ChoreWithLogs, ChoreWithQueue } from "@/types/types";
import { db } from "../lib/config/db";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable,
  whitelistedUsers
} from "../lib/schema";

/**
 * Get all chores from the database.
 */
export async function getChores() {
  const query = sql`
    WITH n AS (
      SELECT * FROM ${choreUserTable} AS cu
      JOIN ${whitelistedUsers} AS u ON cu.user_id = u.id
    )
    SELECT c.*, json_agg(json_build_object('name', n.name, 'id', n.id) ORDER BY n.time_enqueued) AS queue
    FROM ${choresTable} AS c
    LEFT JOIN n ON c.id = n.chore_id
    GROUP BY c.id
  `;

  return (await db.execute(query)) as unknown as ChoreWithQueue[];
}

export async function getChoresDueToday() {
  const query = sql`
    WITH n AS (
      SELECT
        cu.*,
        CASE
          WHEN u.email_notifications THEN u.email
          WHEN NOT u.email_notifications THEN NULL
        END AS email
      FROM ${choreUserTable} AS cu
      JOIN ${userTable} AS u ON cu.user_id = u.whitelist_id
    )
    SELECT c.*, array_agg(n.email ORDER BY n.time_enqueued) AS queue
    FROM ${choresTable} AS c
    LEFT JOIN n ON c.id = n.chore_id
    GROUP BY c.id
    HAVING c.due_date <= NOW()
  `;

  return (await db.execute(query)) as unknown as (Chore & {
    queue: string[];
  })[];
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
