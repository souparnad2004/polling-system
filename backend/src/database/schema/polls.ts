import { index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { relations } from "drizzle-orm";

export const statusEnum = pgEnum("status", ["draft", "published", "closed"])

export const polls = pgTable("polls", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    title: text("title").notNull(),
    description: text("description"),
    status: statusEnum().notNull().default("draft"),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow().$onUpdate(() => new Date)
},(t) => [
    index("polls_status_created_at_index").on(t.status, t.createdAt)
])

export type Poll = typeof polls.$inferSelect;
export type NewPoll = typeof polls.$inferInsert;

export const pollsRelations = relations(polls, ({one, many}) => ({
    users: one(users, {
        fields: [polls.userId],
        references: [users.id]
    }) 
}))