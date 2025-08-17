"use server";

import { shuffle } from "@/lib/utils";
import { db } from "./internal";
import { choresTable, choreUserTable } from "./schema";
import { ChoreInterval } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function createChore(chore: {
  title: string;
  interval: ChoreInterval;
  dueDate: Date;
  peoplePool: string[];
  assignTo: string;
  emoji: string;
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

  console.log("people pool", pool);

  // insert chore
  const [newChore] = await db
    .insert(choresTable)
    .values({
      due_date: chore.dueDate,
      title: chore.title,
      interval: chore.interval,
      emoji: chore.emoji,
      passIndex: 0
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
