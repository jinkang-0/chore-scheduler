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

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
