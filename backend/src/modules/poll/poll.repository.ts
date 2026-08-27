import { asc, eq } from "drizzle-orm";
import { db } from "../../database/client.js";
import { pollOptions } from "../../database/schema/pollOptions.js";
import { polls } from "../../database/schema/polls.js";

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

    async findById(pollId: string) {
        const pollResult = await db.select({
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

        const options = await db.select({
            id: pollOptions.id,
            pollId: pollOptions.pollId,
            option: pollOptions.option,
            position: pollOptions.position,
            createdAt: pollOptions.createdAt,
            updatedAt: pollOptions.updatedAt
        }).from(pollOptions).where(eq(pollOptions.pollId, pollId)).orderBy(asc(pollOptions.position));

        return {...poll, options};
    }
}