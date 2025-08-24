import {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable
} from "@/lib/schema";

type Chore = typeof choresTable.$inferSelect;
type ChoreLog = typeof choreLogTable.$inferSelect;
type User = typeof userTable.$inferSelect;
type ChoreUser = typeof choreUserTable.$inferSelect;
type ChoreInterval = Chore["interval"];
type ChoreLogType = ChoreLog["type"];

interface UserMinimal {
  id: string;
  name: string;
}

interface ChoreMinimal {
  id: string;
  title: string;
  emoji: string;
  due_date: Date;
}

interface LogEntry {
  id: string;
  user_id: string | null;
  timestamp: string;
  message: string;
  type: ChoreLogType;
}

interface ChoreWithLogs extends ChoreMinimal {
  logs: LogEntry[];
}

interface ChoreWithQueue extends Chore {
  queue: UserMinimal[];
}

type ChoreViewIntent = "create" | "update" | "view";
type ButtonVariant = "glass" | "primary" | "ghost" | "secondary" | "danger";

interface DropdownOption {
  label: string;
  value: string;
}
