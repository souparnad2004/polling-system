import { boolean, index, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { relations } from "drizzle-orm";

export const pollStatusEnum = pgEnum("poll_status", ["draft", "published", "closed"])

export const polls = pgTable("polls", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    title: text("title").notNull(),
    description: text("description"),
    status: pollStatusEnum("status").notNull().default("draft"),
    // When false, only authenticated users (user_id votes) may vote on the
    // poll — one-vote-per-account is then strictly enforced by the
    // votes_poll_id_user_id_unique constraint. When true (default), anonymous
    // voterToken voting is allowed on a best-effort one-per-browser basis.
    allowAnonymous: boolean("allow_anonymous").notNull().default(true),
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
