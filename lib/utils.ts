import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge classes using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

/**
 * Checks whether the given string is a valid emoji.
 * @param str - The string to check.
 * @returns True if the string is a valid emoji, false otherwise.
 */
export function isEmoji(str: string): boolean {
  return /^[\p{Extended_Pictographic}]{1}$/u.test(str);
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a date to a short date string.
 * @example formatDate(new Date("2023-01-01")) => "Jan 1, 2023"
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

/**
 * Formats a date to a short date string with weekday, but not year.
 * @example formatDateShort(new Date("2023-01-01")) => "Sun, Jan 1"
 */
export function formatDateShort(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short"
  });
}

/**
 * Formats a date to a short date string with relative hint
 * @example formatDateShortRelative(new Date("2023-01-01")) => "Sun, Jan 1 (today)"
 */
export function formatDateShortRelative(date: Date | string): string {
  const d = new Date(date);
  const ds = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short"
  });
  const relativeHint = getRelativeDay(d);

  return `${ds} (${relativeHint})`;
}

export function getRelativeDay(date: Date | string): string {
  const today = new Date();
  const d = new Date(date);
  const msDiff = d.getTime() - today.getTime();
  const inFuture = msDiff > 0;
  const dayDiff = Math.ceil(Math.abs(msDiff) / 1000 / 60 / 60 / 24);

  return `${inFuture ? "" : "-"}${dayDiff}d`;
}

/**
 * Formats a timestamp to a human-readable string.
 */
export function formatLogTimestamp(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "numeric",
    month: "short",
    year: "numeric",
    second: "2-digit"
  });
}

/**
 * Shuffles an array using the Fisher-Yates (Knuth) algorithm.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Semantically join an array of strings with commas and "and".
 */
export function semanticJoin(arr: string[]): string {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;

  const lastItem = arr.pop();
  return `${arr.join(", ")}, and ${lastItem}`;
}

/**
 * Checks if two arrays are equal in terms of content.
 * Time: O(n)
 */
export function arrayEquality<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;

  const setA = new Set(a);
  const setB = new Set(b);

  for (const item of setA) {
    if (!setB.has(item)) return false;
  }

  for (const item of setB) {
    if (!setA.has(item)) return false;
  }

  return true;
}

/**
 * Normalizes a date to 7 AM UTC, which is midnight PST/PDT.
 * This helps avoid timezone issues when storing dates in the database.
 */
export function normalizeDate(date: Date | string): Date {
  const d = new Date(date);
  d.setHours(7, 0, 0, 0);
  return d;
}

/**
 * Pluralize a word based on a count.
 */
export function optionallyPluralize(count: number, singular: string): string {
  if (count === 1) {
    return singular;
  }
  return `${singular}s`;
}
