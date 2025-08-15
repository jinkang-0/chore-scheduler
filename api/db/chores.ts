"use server";

import { db } from ".";
import { choresTable } from "./schema";

export async function getChores() {
  return await db.select().from(choresTable);
}
