"use server";

import { shuffle } from "@/lib/utils";
import { db } from "./internal";
import {
  choreLogTable,
  choresTable,
  choreUserTable,
  whitelistedUsers
} from "./schema";
import { ChoreInterval } from "@/types/types";
import { revalidatePath } from "next/cache";
import { monthdayOptions, weekdayOptions } from "@/data/dropdown";
import { authConfig } from "../auth/config";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

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
        due_date: chore.dueDate,
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
