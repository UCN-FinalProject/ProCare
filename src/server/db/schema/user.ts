import { relations } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  text,
  pgTable,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const userRole = pgEnum("role", ["admin", "user"]);

export const users = pgTable("user", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$default(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified").$defaultFn(() => new Date()),
  role: userRole("role")
    .notNull()
    .$default(() => "user"),
  doctorID: text("doctorId"),
  // this is only for next auth
  // otherwise it will throw an error
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  credentials: many(credentials),
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
    credentialPublicKey: json("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    transports: text("transports").array().notNull(),
  },
  (credential) => ({
    userIdIdx: index("cred_userId_idx").on(credential.userId),
  }),
);

export const credentialsRelations = relations(credentials, ({ one }) => ({
  user: one(users, { fields: [credentials.userId], references: [users.id] }),
}));
