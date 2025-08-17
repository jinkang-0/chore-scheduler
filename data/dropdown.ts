import { getPeople } from "@/api/db";

export const intervalOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" }
];

export const getPeoplePoolOptions = async () => {
  const users = await getPeople();
  return users.map((user) => ({
    value: user.id,
    label: user.name
  }));
};
