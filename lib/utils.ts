import clsx, { ClassValue } from "clsx";
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
 * Formats a date to a short date string.
 * @example formatDate(new Date("2023-01-01")) => "Jan 1, 2023"
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
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
