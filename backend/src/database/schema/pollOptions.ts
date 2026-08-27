import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { polls } from "./polls.js";
import { relations } from "drizzle-orm";

export const pollOptions = pgTable("poll_options", {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id").notNull().references(() => polls.id, {onDelete: "cascade"}),
    option: text("option").notNull(),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => [
    unique("poll_options_poll_position_unique").on(t.pollId, t.position)
])

export type PollOption = typeof pollOptions.$inferSelect;
export type NewPollOption = typeof pollOptions.$inferInsert;

export const pollOptionsRelations = relations(pollOptions, ({one}) => ({
    polls: one(polls, {
        fields: [pollOptions.pollId],
        references: [polls.id]
    })
}))