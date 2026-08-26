import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { credentials } from "./credentials.js";
import { sessions } from "./sessions.js";
import { polls } from "./polls.js";

export const statusEnum = pgEnum("status", ["active", "inactive"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    displayName: varchar("display_name", { length: 100 }),
    status: statusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const usersRelations = relations(users, ({one, many}) => ({
    credentials: one(credentials, {
        fields: [users.id],
        references: [credentials.userId]
    }),
    sessions: many(sessions),

    polls: many(polls),
}))