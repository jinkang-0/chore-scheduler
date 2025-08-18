"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "./internal";
import { choresTable, choreUserTable, userTable } from "./schema";
import { ChoreWithQueue } from "@/types/types";
import { revalidateTag } from "next/cache";

export async function markChoreAsDone(choreId: string) {
  const query = sql`
      WITH n AS (
        SELECT * FROM ${choreUserTable} AS cu
        JOIN ${userTable} AS u ON cu.user_id = u.id
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
  }

  // rotate queue
  const assignedTo = chore.queue[0];

  await db.delete(choreUserTable).where(eq(choreUserTable.user_id, assignedTo));
  await db.insert(choreUserTable).values({
    chore_id: chore.id,
    user_id: assignedTo,
    time_enqueued: new Date()
  });

  // update chore's due date and pass index
  await db.update(choresTable).set({
    due_date: nextDueDate,
    passIndex: 0
  });

  revalidateTag(choreId);
}
