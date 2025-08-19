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
  "SUCCESS",
  "WARNING",
  "ERROR"
]);

// used for whitelisting users for login
// also used to inform people pool selection if account is not yet created
export const whitelistedUsers = pgTable("whitelisted_users", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull()
});

export const userTable = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  email: text().notNull().unique(),
  name: text().notNull(), // only used to set initial username in profile
  // unused, but required by next-auth
  emailVerified: timestamp({ withTimezone: true }),
  image: text()
});

// store preferences for notifications and other user settings
export const profileTable = pgTable("profile", {
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  name: text().notNull(),
  email_notifications: boolean().notNull().default(true)
});

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
);

export const sessionsTable = pgTable("sessions", {
  sessionToken: text().primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expires: timestamp({ withTimezone: true }).notNull()
});

export const authenticatorsTable = pgTable(
  "authenticators",
  {
    credentialId: text().notNull().unique(),
    userId: uuid()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    providerAccountId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: integer().notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: boolean().notNull(),
    transports: text()
  },
  (table) => [primaryKey({ columns: [table.credentialId, table.userId] })]
);

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
