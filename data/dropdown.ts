import { getWhitelistedPeople } from "@/api/actions";

export const intervalOptions = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" }
] as const;

type IntervalOptionValues = (typeof intervalOptions)[number]["value"];
type IntervalOptionLabels = (typeof intervalOptions)[number]["label"];

export const intervalMap = intervalOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {} as Record<IntervalOptionValues, IntervalOptionLabels>);

export const weekdayOptions = [
  { value: null, label: "No specific day" },
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" }
] as const;

type WeekdayOptionValues =
  | Exclude<(typeof weekdayOptions)[number]["value"], null>
  | "null";
type WeekdayOptionLabels = (typeof weekdayOptions)[number]["label"];

export const weekdayMap = weekdayOptions.reduce((acc, option) => {
  acc[new String(option.value) as WeekdayOptionValues] = option.label;
  return acc;
}, {} as Record<WeekdayOptionValues, WeekdayOptionLabels>);

export const monthdayOptions = [
  { value: null, label: "No specific day" },
  { value: "1", label: "day 1" },
  { value: "2", label: "day 2" },
  { value: "3", label: "day 3" },
  { value: "4", label: "day 4" },
  { value: "5", label: "day 5" },
  { value: "6", label: "day 6" },
  { value: "7", label: "day 7" },
  { value: "8", label: "day 8" },
  { value: "9", label: "day 9" },
  { value: "10", label: "day 10" },
  { value: "11", label: "day 11" },
  { value: "12", label: "day 12" },
  { value: "13", label: "day 13" },
  { value: "14", label: "day 14" },
  { value: "15", label: "day 15" },
  { value: "16", label: "day 16" },
  { value: "17", label: "day 17" },
  { value: "18", label: "day 18" },
  { value: "19", label: "day 19" },
  { value: "20", label: "day 20" },
  { value: "21", label: "day 21" },
  { value: "22", label: "day 22" },
  { value: "23", label: "day 23" },
  { value: "24", label: "day 24" },
  { value: "25", label: "day 25" },
  { value: "26", label: "day 26" },
  { value: "27", label: "day 27" },
  { value: "28", label: "day 28" }
] as const;

type MonthdayOptionValues =
  | Exclude<(typeof monthdayOptions)[number]["value"], null>
  | "null";
type MonthdayOptionLabels = (typeof monthdayOptions)[number]["label"];

export const monthdayMap = monthdayOptions.reduce((acc, option) => {
  acc[new String(option.value) as MonthdayOptionValues] = option.label;
  return acc;
}, {} as Record<MonthdayOptionValues, MonthdayOptionLabels>);

export const getPeoplePoolOptions = async () => {
  const users = await getWhitelistedPeople();
  return users.map((user) => ({
    value: user.id,
    label: user.name
  }));
};
