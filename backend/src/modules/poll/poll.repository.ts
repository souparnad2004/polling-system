import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../database/client.js";
import { pollOptions } from "../../database/schema/pollOptions.js";
import { polls } from "../../database/schema/polls.js";
import { UpdatePollInput } from "./poll.schema.js";
import { unescape } from "node:querystring";

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class PollRepository  {
    async createPoll(tx: DatabaseTransaction, input: {userId: string; title: string; description?: string}) {
        const [result] = await tx.insert(polls).values({
            userId: input.userId,
            title: input.title,
            description: input.description,
        }).returning();

        return result;
    }

    async createOptions(tx: DatabaseTransaction, input: {pollId: string; options: string[]}) {
        return tx.insert(pollOptions).values(
            input.options.map((option, position) => ({
                pollId: input.pollId,
                option,
                position                
            }))
        ).returning()
    }

    async findById(pollId: string, tx?: DatabaseTransaction) {
        const query = tx ?? db;
        const pollResult = await query.select({
            id: polls.id,
            userId: polls.userId,
            title: polls.title,
            description: polls.description,
            status: polls.status,
            createdAt: polls.createdAt,
            updatedAt: polls.updatedAt
        }).from(polls).where(eq(polls.id, pollId)).limit(1);

        const poll = pollResult[0];
        if(!poll) return null;

        const options = await query.select({
            id: pollOptions.id,
            pollId: pollOptions.pollId,
            option: pollOptions.option,
            position: pollOptions.position,
            createdAt: pollOptions.createdAt,
            updatedAt: pollOptions.updatedAt
        }).from(pollOptions).where(eq(pollOptions.pollId, pollId)).orderBy(asc(pollOptions.position));

        return {...poll, options};
    }

    async findByUserId(userId: string) {
        const pollResults = await db.select({
            id: polls.id,
            userId: polls.userId,
            title: polls.title,
            description: polls.description,
            status: polls.status,
            createdAt: polls.createdAt,
            updatedAt: polls.updatedAt,
        }).from(polls).where(eq(polls.userId, userId)).orderBy(desc(polls.createdAt));

        if (pollResults.length === 0) return [];

        const pollIds = pollResults.map((poll) => poll.id);

        const options = await db.select({
            id: pollOptions.id,
            pollId: pollOptions.pollId,
            option: pollOptions.option,
            position: pollOptions.position,
            createdAt: pollOptions.createdAt,
            updatedAt: pollOptions.updatedAt,
        }).from(pollOptions).where(inArray(pollOptions.pollId, pollIds)).orderBy(asc(pollOptions.position));

        const optionsByPoll = new Map<string, typeof options>();
        for (const option of options) {
            const existing = optionsByPoll.get(option.pollId) ?? [];
            existing.push(option);
            optionsByPoll.set(option.pollId, existing);
        }

        return pollResults.map((poll) => ({
            ...poll,
            options: optionsByPoll.get(poll.id) ?? [],
        }));
    }

    async updatePoll(tx: DatabaseTransaction, pollId: string, input: UpdatePollInput) {
        const result = await tx.update(polls).set({
            ...(input.title !== undefined && {title: input.title}),
            ...(input.description !== undefined && {description: input.description}),
        }).where(eq(polls.id, pollId)).returning();

        return result[0] ?? null;
    }

    async deleteOptions(tx: DatabaseTransaction, pollId: string) {
        await tx.delete(pollOptions).where(eq(pollOptions.pollId, pollId));
    }

    async publishPoll(pollId: string) {
        const result = await db.update(polls).set({status: "published"}).where(and(eq(polls.id, pollId), eq(polls.status, "draft"))).returning();

        return result[0] ?? null;
    }

    async closePoll(pollId: string) {
        const result = await db.update(polls).set({status: "closed"}).where(and(eq(polls.id, pollId), eq(polls.status, "published"))).returning();

        return result[0] ?? null;
    }

    async deletePoll(pollId: string) {
        await db.delete(polls).where(eq(polls.id, pollId)); 
    }

}