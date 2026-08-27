import { pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { polls } from "./polls.js";
import { pollOptions } from "./pollOptions.js";
import { users } from "./users.js";
import { relations } from "drizzle-orm";

export const votes = pgTable("votes", {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id").notNull().references(() => polls.id, {onDelete: "cascade"}),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}),
    optionId: uuid("option_id").notNull().references(() => pollOptions.id, {onDelete: "cascade"}),
    voter_token: uuid("voter_token").notNull().unique(),
    createdAt: timestamp("created_at", {withTimezone: true}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).notNull().defaultNow().$onUpdate(() => new Date()),
},(t) => [
    unique("votes_poll_id_user_id_unique").on(t.pollId, t.userId),
    unique("votes_poll_id_voter_token_unique").on(t.pollId, t.voter_token)
])

export type Vote = typeof votes.$inferSelect
export type NewVote = typeof votes.$inferInsert


export const votesRelations = relations(votes, ({one}) => ({
    poll: one(polls,{
        fields: [votes.pollId],
        references: [polls.id]
    }),
    option: one(pollOptions, {
        fields: [votes.optionId],
        references: [pollOptions.id]
    }),
    user: one(users, {
        fields: [votes.userId],
        references: [users.id]
    })
}))