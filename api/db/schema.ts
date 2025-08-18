import {
  text,
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  primaryKey,
  integer
} from "drizzle-orm/pg-core";

export const choreIntervalEnum = pgEnum("chore_interval", [
  "DAILY",
  "WEEKLY",
  "MONTHLY"
]);

export const choreLogTypeEnum = pgEnum("chore_log_type", [
  "INFO",
  "SUCCESS",
  "WARNING",
  "ERROR"
]);

export const userTable = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull()
}).enableRLS();

export const choresTable = pgTable("chores", {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  emoji: text().notNull(),
  interval: choreIntervalEnum().notNull(),
  due_date: timestamp({ withTimezone: true }).notNull(),
  passIndex: integer().notNull().default(0),
  weekday: integer(),
  monthday: integer()
}).enableRLS();

export const choreUserTable = pgTable(
  "chore_user",
  {
    chore_id: uuid()
      .notNull()
      .references(() => choresTable.id, { onDelete: "cascade" }),
    user_id: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    time_enqueued: timestamp({ withTimezone: true }).notNull().defaultNow()
  },
  (table) => [primaryKey({ columns: [table.chore_id, table.user_id] })]
).enableRLS();

export const choreLogTable = pgTable("chore_log", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  chore_id: uuid()
    .notNull()
    .references(() => choresTable.id),
  timestamp: timestamp({ withTimezone: true }).notNull(),
  message: text().notNull(),
  type: choreLogTypeEnum().notNull()
}).enableRLS();
