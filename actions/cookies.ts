"use server";

import { cookies } from "next/headers";
import type { ViewMode } from "@/types/types";

export async function setViewModeCookie(viewMode: ViewMode) {
  const cookieStore = await cookies();
  cookieStore.set("viewMode", viewMode);
}

export async function getViewModeCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("viewMode");
}
