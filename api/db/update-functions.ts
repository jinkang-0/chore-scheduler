"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "./internal";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable,
  whitelistedUsers
} from "./schema";
import { ChoreWithQueue } from "@/types/types";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authConfig } from "../auth/config";

/**
 * Mark the chore as done by updating its due date and rotating the queue.
 * A log entry is created for the action.
 * The authenticated user is placed at the end of the queue.
 */
export async function markChoreAsDone(choreId: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const query = sql`
      WITH n AS (
        SELECT * FROM ${choreUserTable} AS cu
        JOIN ${whitelistedUsers} AS u ON cu.user_id = u.id
      )
      SELECT c.*, array_agg(n.id ORDER BY n.time_enqueued) AS queue
      FROM ${choresTable} AS c
      LEFT JOIN n ON c.id = n.chore_id
      GROUP BY c.id
      HAVING c.id = ${choreId}
    `;

  const [chore] = (await db.execute(query)) as unknown as ChoreWithQueue[];

  if (!chore) {
    throw new Error("Chore not found");
  }

  // update the chore's due date to the next occurrence based on its interval
  const today = new Date();
  const nextDueDate = new Date();

  if (chore.interval === "DAILY") {
    nextDueDate.setDate(nextDueDate.getDate() + 1);
  } else if (chore.interval === "WEEKLY") {
    const currentDay = nextDueDate.getDay();
    const targetDay = chore.weekday || currentDay;
    const daysUntilNext = (targetDay - currentDay + 7) % 7 || 7;

    // ensure next occurrence doesn't occur within the next 3 days
    const daysToAdd = daysUntilNext < 3 ? daysUntilNext + 7 : daysUntilNext;

    nextDueDate.setDate(nextDueDate.getDate() + daysToAdd);
  } else if (chore.interval === "MONTHLY") {
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    // if chore has a specific monthday, set it
    if (chore.monthday) nextDueDate.setDate(chore.monthday);

    // if it's within 3 days, move to the next month
    if (
      Math.abs(nextDueDate.getTime() - today.getTime()) <
      3 * 24 * 60 * 60 * 1000
    ) {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }

    // ensure next occurrence is in the next month
    // if it skips to the month after, adjust to the last day of next month
    if (!chore.monthday) {
      const nextYear = nextDueDate.getFullYear();
      const thisYear = today.getFullYear();
      const thisMonth = today.getMonth();
      const nextMonth =
        nextYear == thisYear
          ? nextDueDate.getMonth()
          : nextDueDate.getMonth() + 12;

      if (nextMonth > thisMonth + 1) nextDueDate.setDate(0);
    }

    // we're afforded the ability to not check if the monthday is valid
    // because the monthday is within the range of 1-28
    // thus guaranteeing incrementing the month will not overflow to the month after

    revalidatePath("/");
  }

  await db.transaction(async (tx) => {
    // rotate queue
    await tx
      .delete(choreUserTable)
      .where(eq(choreUserTable.user_id, session.user.whitelist_id));

    await tx.insert(choreUserTable).values({
      chore_id: chore.id,
      user_id: session.user.whitelist_id,
      time_enqueued: new Date()
    });

    // update chore's due date and pass index
    await tx.update(choresTable).set({
      due_date: nextDueDate,
      passIndex: 0
    });

    // add log
    await tx.insert(choreLogTable).values({
      chore_id: chore.id,
      user_id: session.user.whitelist_id,
      type: "SUCCESS",
      message: `Completed by ${session.user.name}`
    });
  });

  revalidatePath("/");
}

/**
 * Update the username of the authenticated user.
 */
export async function updateUsername(name: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await db
    .update(whitelistedUsers)
    .set({ name })
    .where(eq(whitelistedUsers.id, session.user.whitelist_id));

  revalidatePath("/");
}

/**
 * Set the user as having completed the onboarding process.
 */
export async function setOnboarded() {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await db
    .update(userTable)
    .set({ is_onboarded: true })
    .where(eq(userTable.id, session.user.id));

  revalidatePath("/");
}

/**
 * Update the due date of a chore.
 */
export async function updateChoreDueDate(choreId: string, dueDate: Date) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await db
    .update(choresTable)
    .set({ due_date: dueDate })
    .where(eq(choresTable.id, choreId));

  revalidatePath("/");
}
