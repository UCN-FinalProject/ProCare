import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  text,
  pgTable,
  timestamp,
  json,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified").$defaultFn(() => new Date()),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  credentials: many(credentials),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("acc_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  },
  (session) => ({
    userIdIdx: index("sess_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const credentials = pgTable(
  "credential",
  {
    id: text("id")
      .notNull()
      .primaryKey()
      .$default(() => createId()),
    credentialID: text("credentialID").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    credentialPublicKey: jsonb("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    transports: json("transports").notNull(),
  },
  (credential) => ({
    userIdIdx: index("cred_userId_idx").on(credential.userId),
  }),
);

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, { fields: [credentials.userId], references: [users.id] }),
}));
