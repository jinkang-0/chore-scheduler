import type {
  choreLogTable,
  choresTable,
  choreUserTable,
  userTable
} from "@/lib/schema";

export type Chore = typeof choresTable.$inferSelect;
export type ChoreLog = typeof choreLogTable.$inferSelect;
export type User = typeof userTable.$inferSelect;
export type ChoreUser = typeof choreUserTable.$inferSelect;
export type ChoreInterval = Chore["interval"];
export type ChoreLogType = ChoreLog["type"];

export interface UserMinimal {
  id: string;
  name: string;
}

export interface ChoreMinimal {
  id: string;
  title: string;
  emoji: string;
  due_date: Date;
}

export interface LogEntry {
  id: string;
  user_id: string | null;
  timestamp: string;
  message: string;
  type: ChoreLogType;
}

export interface ChoreWithLogs extends ChoreMinimal {
  logs: LogEntry[];
}

export interface ChoreWithQueue extends Chore {
  queue: UserMinimal[];
}

export interface ChoreWithQueueEx extends ChoreWithQueue {
  includesUser: boolean;
}

export type ChoreViewIntent = "create" | "update" | "view";
export type ButtonVariant =
  | "glass"
  | "primary"
  | "ghost"
  | "secondary"
  | "danger";

export interface DropdownOption {
  label: string;
  value: string;
}

export type ViewMode = "private" | "global";
