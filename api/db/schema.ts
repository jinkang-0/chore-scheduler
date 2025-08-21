import {
  text,
  pgTable,
  uuid,
  pgEnum,
  timestamp,
  primaryKey,
  integer,
  boolean
} from "drizzle-orm/pg-core";

export const choreIntervalEnum = pgEnum("chore_interval", [
  "DAILY",
  "WEEKLY",
  "MONTHLY"
]);

export const choreLogTypeEnum = pgEnum("chore_log_type", [
  "INFO",
  "WARNING",
  "ERROR"
]);

// used for whitelisting users for login
// also used to inform people pool selection if account is not yet created
// therefore this id is referenced for chores as well
export const whitelistedUsers = pgTable("whitelisted_users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(),
  email_notifications: boolean().notNull().default(true)
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
      .references(() => whitelistedUsers.id, { onDelete: "cascade" }),
    time_enqueued: timestamp({ withTimezone: true }).notNull().defaultNow()
  },
  (table) => [primaryKey({ columns: [table.chore_id, table.user_id] })]
).enableRLS();

export const choreLogTable = pgTable("chore_log", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  chore_id: uuid()
    .notNull()
    .references(() => choresTable.id, { onDelete: "cascade" }),
  user_id: uuid()
    .notNull()
    .references(() => whitelistedUsers.id, { onDelete: "set null" }),
  timestamp: timestamp({ withTimezone: true }).notNull().defaultNow(),
  message: text().notNull(),
  type: choreLogTypeEnum().notNull()
}).enableRLS();

//
// NextAuth tables
//

export const userTable = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(), // only used to set initial username in profile
  // unused, but required by next-auth
  emailVerified: timestamp({ withTimezone: true }),
  image: text(),
  // custom
  whitelist_id: uuid().references(() => whitelistedUsers.id, {
    onDelete: "cascade"
  }),
  is_onboarded: boolean().notNull().default(false)
}).enableRLS();

export const accountsTable = pgTable(
  "accounts",
  {
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer(),
    token_type: text(),
    scope: text(),
    id_token: text(),
    session_state: text()
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] })
  ]
).enableRLS();

export const sessionsTable = pgTable("sessions", {
  sessionToken: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expires: timestamp({ withTimezone: true }).notNull()
}).enableRLS();
