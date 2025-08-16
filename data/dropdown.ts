import { getPeople } from "@/api/db";

export const intervalOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
];

export const weekdayOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

export const monthdayOptions = Array.from({ length: 28 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `day ${i + 1}`
}));

export const getPeoplePoolOptions = async () => {
  const users = await getPeople();
  return users.map((user) => ({
    value: user.id,
    label: user.name
  }));
};
