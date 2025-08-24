"use server";

import { db } from "@/lib/config/db";
import { choresTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Delete a chore by its ID.
 */
export async function deleteChore(choreId: string) {
  await db.delete(choresTable).where(eq(choresTable.id, choreId));

  revalidatePath("/");
}
