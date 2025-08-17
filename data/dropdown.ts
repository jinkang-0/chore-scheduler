import { getPeople } from "@/api/db";

export const intervalOptions = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" }
] as const;

export const getPeoplePoolOptions = async () => {
  const users = await getPeople();
  return users.map((user) => ({
    value: user.id,
    label: user.name
  }));
};
