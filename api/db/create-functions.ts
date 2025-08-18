"use server";

import { shuffle } from "@/lib/utils";
import { db } from "./internal";
import { choresTable, choreUserTable } from "./schema";
import { ChoreInterval } from "@/types/types";
import { revalidatePath } from "next/cache";
import { monthdayOptions, weekdayOptions } from "@/data/dropdown";

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

  // randomize people pool
  const peoplePoolWithoutAssignTo = shuffle(
    chore.peoplePool.filter((userId) => userId !== chore.assignTo)
  );
  const pool = [chore.assignTo, ...peoplePoolWithoutAssignTo];

  // insert chore
  const [newChore] = await db
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
  const today = new Date();
  const todayMs = today.getTime();
  const queue = pool.map((userId, idx) => ({
    chore_id: newChore.id,
    user_id: userId,
    time_enqueued: new Date(todayMs + idx * 1000)
  }));

  await db.insert(choreUserTable).values(queue);

  // revalidate main page
  revalidatePath("/");
}
