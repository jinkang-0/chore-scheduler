import {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable
} from "@/api/db/schema";

type Chore = typeof choresTable.$inferSelect;
type ChoreLog = typeof choreLogTable.$inferSelect;
type User = typeof userTable.$inferSelect;
type ChoreUser = typeof choreUserTable.$inferSelect;
type ChoreInterval = Chore["interval"];
type ChoreLogType = ChoreLog["type"];

interface ChoreWithQueue extends Chore {
  queue: string[];
}

type ChoreViewIntent = "create" | "update" | "view";

interface DropdownOption {
  label: string;
  value: string;
}
