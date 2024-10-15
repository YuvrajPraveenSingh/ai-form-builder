import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "next-auth/adapters";
import { relations } from "drizzle-orm";

const connectionString = process.env.DB_URI!;
const pool = postgres(connectionString, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
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
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
);

export const forms = pgTable("form", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  userId: text("userId").notNull(),
  published: boolean("published"),
  createdAt: timestamp("createdAt", { mode: "date" }),
});

export const formElements = pgEnum("field_type", [
  "Textarea",
  "Select",
  "Input",
  "RadioGroup",
  "Switch",
]);

export const questions = pgTable("question", {
  id: serial("id").primaryKey(),
  text: text("text"),
  fieldType: formElements("field_type"),
  formId: integer("formId").notNull(),
});

export const feildOptions = pgTable("field_option", {
  id: serial("id").primaryKey(),
  text: text("text"),
  value: text("value"),
  questionId: integer("question_Id").notNull(),
});

export const formRelations = relations(forms, ({ many, one }) => ({
  questions: many(questions),
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
}));

export const questionRelations = relations(questions, ({ many, one }) => ({
  options: many(feildOptions),
  form: one(forms, {
    fields: [questions.formId],
    references: [forms.id],
  }),
  feildOptions: many(feildOptions),
}));

export const fieldOptionsRelations = relations(feildOptions, ({ one }) => ({
  question: one(questions, {
    fields: [feildOptions.questionId],
    references: [questions.id],
  }),
}));
