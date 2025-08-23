"use server";

import {
  arrayEquality,
  normalizeDate,
  semanticJoin,
  shuffle
} from "@/lib/utils";
import { db } from "../lib/config/db";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable,
  whitelistedUsers
} from "../lib/schema";
import {
  ChoreInterval,
  ChoreLog,
  ChoreWithLogs,
  ChoreWithQueue
} from "@/types/types";
import { revalidatePath } from "next/cache";
import { monthdayOptions, weekdayOptions } from "@/data/dropdown";
import { authConfig } from "../lib/config/auth";
import { getServerSession } from "next-auth";
import { and, eq, inArray, sql } from "drizzle-orm";
import { nodemailerTransponder } from "@/lib/config/messaging";

//
// EMAIL functions
//

if (!process.env.SMTP_SENDER_NAME || !process.env.SMTP_SENDER_EMAIL)
  throw new Error(
    "SMTP_SENDER_NAME and SMTP_SENDER_EMAIL must be set in the environment variables"
  );

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return await nodemailerTransponder.sendMail({
    from: {
      name: process.env.SMTP_SENDER_NAME!,
      address: process.env.SMTP_SENDER_EMAIL!
    },
    to,
    subject,
    html
  });
}

//
// CREATE functions
//

export async function createChore(chore: {
  title: string;
  interval: ChoreInterval;
  dueDate: Date;
  peoplePool: string[];
  assignTo: string;
  emoji: string;
  weekday: (typeof weekdayOptions)[number]["value"] | null;
  monthday: (typeof monthdayOptions)[number]["value"] | null;
}) {
  // ensure assignTo is in the people pool
  if (!chore.peoplePool.includes(chore.assignTo)) {
    throw new Error("Assigned person must be in the people pool");
  }

  // get authenticated user
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // get assigned to user
  const [assignedUser] = await db
    .select()
    .from(whitelistedUsers)
    .where(eq(whitelistedUsers.id, chore.assignTo));
  const assignedName = assignedUser?.name || "Unknown";

  // randomize people pool
  const peoplePoolWithoutAssignTo = shuffle(
    chore.peoplePool.filter((userId) => userId !== chore.assignTo)
  );
  const pool = [chore.assignTo, ...peoplePoolWithoutAssignTo];

  // create queue
  const today = new Date();
  const todayMs = today.getTime();

  await db.transaction(async (tx) => {
    // insert chore
    const [newChore] = await tx
      .insert(choresTable)
      .values({
        due_date: normalizeDate(chore.dueDate),
        title: chore.title,
        interval: chore.interval,
        emoji: chore.emoji,
        passIndex: 0,
        weekday: chore.weekday ? Number(chore.weekday) : null,
        monthday: chore.monthday ? Number(chore.monthday) : null
      })
      .returning();

    // insert queue
    const queue = pool.map((userId, idx) => ({
      chore_id: newChore.id,
      user_id: userId,
      time_enqueued: new Date(todayMs + idx * 1000)
    }));

    await tx.insert(choreUserTable).values(queue);

    // insert log
    await tx.insert(choreLogTable).values([
      {
        chore_id: newChore.id,
        user_id: session.user.whitelist_id,
        type: "INFO",
        message: `Chore created by ${session.user.name}`,
        timestamp: today
      },
      {
        chore_id: newChore.id,
        user_id: chore.assignTo,
        type: "INFO",
        message: `Chore assigned to ${assignedName}`,
        timestamp: new Date(todayMs + 1000)
      }
    ]);
  });

  // revalidate main page
  revalidatePath("/");
}

//
// UPDATE functions
//

/**
 * Helper function to get a chore with its queue by ID.
 */
async function getChoreWithQueue(choreId: string) {
  const query = sql`
      WITH n AS (
        SELECT * FROM ${choreUserTable} AS cu
        JOIN ${whitelistedUsers} AS u ON cu.user_id = u.id
      )
      SELECT c.*, json_agg(json_build_object('name', n.name, 'id', n.id) ORDER BY n.time_enqueued) AS queue
      FROM ${choresTable} AS c
      LEFT JOIN n ON c.id = n.chore_id
      GROUP BY c.id
      HAVING c.id = ${choreId}
    `;

  const [chore] = (await db.execute(query)) as unknown as ChoreWithQueue[];

  return chore;
}

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

  const chore = await getChoreWithQueue(choreId);

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

  // determine logs to add
  const logs: Omit<ChoreLog, "id">[] = [
    {
      chore_id: chore.id,
      user_id: session.user.whitelist_id,
      type: "INFO",
      message: `Completed by ${session.user.name}`,
      timestamp: new Date()
    }
  ];

  // find user position in queue
  const userIndex = chore.queue.findIndex(
    (user) => user.id === session.user.whitelist_id
  );
  const nextUser =
    chore.queue[userIndex === 0 && chore.queue.length > 1 ? 1 : 0];
  const assignedUser = chore.queue[chore.passIndex % chore.queue.length];
  const userIsAssigned = session.user.whitelist_id === assignedUser.id;
  const now = Date.now();

  if (userIsAssigned) {
    logs.push({
      chore_id: chore.id,
      user_id: nextUser.id,
      type: "INFO",
      message: `Assigned to ${nextUser.name}`,
      timestamp: new Date(now + 1000)
    });
  }

  await db.transaction(async (tx) => {
    // rotate queue
    await tx
      .delete(choreUserTable)
      .where(
        and(
          eq(choreUserTable.user_id, session.user.whitelist_id),
          eq(choreUserTable.chore_id, chore.id)
        )
      );

    await tx.insert(choreUserTable).values({
      chore_id: chore.id,
      user_id: session.user.whitelist_id,
      time_enqueued: new Date()
    });

    // update chore's due date and pass index
    await tx
      .update(choresTable)
      .set({
        due_date: nextDueDate,
        passIndex: 0
      })
      .where(eq(choresTable.id, chore.id));

    await tx.insert(choreLogTable).values(logs);
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

  // update names
  await db.transaction(async (tx) => {
    await db
      .update(whitelistedUsers)
      .set({ name })
      .where(eq(whitelistedUsers.id, session.user.whitelist_id));

    await db
      .update(userTable)
      .set({ name })
      .where(eq(userTable.id, session.user.id));
  });

  revalidatePath("/");
}

/**
 * Increment the pass index of a chore.
 */
export async function incrementChorePassIndex(choreId: string) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  // check who will be next in queue
  const chore = await getChoreWithQueue(choreId);
  if (!chore || !chore.queue || chore.queue.length === 0) {
    throw new Error("Chore not found");
  }

  const nextUser = chore.queue[(chore.passIndex + 1) % chore.queue.length];
  const now = Date.now();

  await db.transaction(async (tx) => {
    // increment the pass index of the chore
    await tx
      .update(choresTable)
      .set({ passIndex: sql`${choresTable.passIndex} + 1` })
      .where(eq(choresTable.id, choreId));

    // add log
    await tx.insert(choreLogTable).values([
      {
        chore_id: choreId,
        user_id: session.user.whitelist_id,
        type: "INFO",
        message: `${session.user.name} passed`,
        timestamp: new Date(now)
      },
      {
        chore_id: choreId,
        user_id: nextUser.id,
        type: "INFO",
        message: `Assigned to ${nextUser.name}`,
        timestamp: new Date(now + 1000)
      }
    ]);
  });

  revalidatePath("/");
}

/**
 *
 */
export async function updateChore(chore: {
  id: string;
  title: string;
  emoji: string;
  interval: "DAILY" | "WEEKLY" | "MONTHLY";
  weekday?: number | null;
  monthday?: number | null;
  dueDate: Date;
  peoplePool: string[];
}) {
  // ensure the user is authenticated
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const oldChore = await getChoreWithQueue(chore.id);

  // find what changed
  const changes: string[] = [];

  if (chore.title !== oldChore.title) changes.push("title");
  if (chore.emoji !== oldChore.emoji) changes.push("emoji");

  const oldDueDate = new Date(oldChore.due_date).toLocaleDateString();
  const newDueDate = new Date(chore.dueDate).toLocaleDateString();
  if (oldDueDate !== newDueDate) changes.push("due date");

  if (
    chore.interval !== oldChore.interval ||
    chore.monthday !== oldChore.monthday ||
    chore.weekday !== oldChore.weekday
  )
    changes.push("interval");

  if (
    !arrayEquality(
      chore.peoplePool,
      oldChore.queue.map((u) => u.id)
    )
  ) {
    changes.push("people pool");
  }

  // find removed and newly added users (if any)
  const removedUsers = oldChore.queue
    .filter((user) => !chore.peoplePool.includes(user.id))
    .map((user) => user.id);

  const newUsers = chore.peoplePool.filter(
    (userId) => !oldChore.queue.some((u) => u.id === userId)
  );

  const now = Date.now();
  const newQueue = newUsers.map((userId, idx) => ({
    chore_id: chore.id,
    user_id: userId,
    time_enqueued: new Date(now + idx * 1000)
  }));

  // update the chore in the database
  await db.transaction(async (tx) => {
    // update the chore details
    await tx
      .update(choresTable)
      .set({
        title: chore.title,
        emoji: chore.emoji,
        interval: chore.interval,
        weekday: chore.weekday ?? null,
        monthday: chore.monthday ?? null,
        due_date: normalizeDate(chore.dueDate)
      })
      .where(eq(choresTable.id, chore.id));

    // remove removed users from queue
    await tx
      .delete(choreUserTable)
      .where(inArray(choreUserTable.user_id, removedUsers));

    // add new users to the queue
    if (newQueue.length > 0) {
      await tx.insert(choreUserTable).values(newQueue);
    }

    // add log entry for the update
    await tx.insert(choreLogTable).values({
      chore_id: chore.id,
      user_id: session.user.whitelist_id,
      type: "WARNING",
      message:
        changes.length > 0
          ? `${session.user.name} changed the ${semanticJoin(changes)}`
          : `${session.user.name} updated chore details`
    });
  });

  revalidatePath("/");
}

/**
 * Update the user's email notification preference.
 */
export async function updateEmailNotifications(enabled: boolean) {
  const session = await getServerSession(authConfig);
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  await db
    .update(userTable)
    .set({ email_notifications: enabled })
    .where(eq(userTable.id, session.user.id));

  revalidatePath("/");
}

//
// GET functions
//

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
