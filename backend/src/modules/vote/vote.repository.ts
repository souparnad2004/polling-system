import { and, eq, or, sql } from "drizzle-orm";
import { db } from "../../database/client.js";
import { votes } from "../../database/schema/votes.js";
import { pollOptions } from "../../database/schema/pollOptions.js";

export class VoteRepository {
    async create(input: {pollId: string; optionId: string; userId?: string; voterToken?: string}) {
        const result = await db.insert(votes).values({
            pollId: input.pollId,
            optionId: input.optionId,
            userId: input.userId ?? null,
            voterToken: input.voterToken ?? null
        }).returning();

        return result[0];
    }

    // Find a single vote for a poll, matching an authenticated user OR an
    // anonymous voter token. A vote row stores exactly one of the two, so we
    // must look them up with OR (never AND).
    async findByVoter(pollId: string, userId?: string, voterToken?: string) {
        const identityConditions: ReturnType<typeof eq>[] = [];

        if(userId) identityConditions.push(eq(votes.userId, userId));
        if(voterToken) identityConditions.push(eq(votes.voterToken, voterToken));

        if(identityConditions.length === 0) return null;

        const result = await db.select().from(votes)
            .where(and(eq(votes.pollId, pollId), or(...identityConditions)))
            .limit(1);

        return result[0] ?? null;
    }

    async updateOption(voteId: string, optionId: string) {
        const result = await db.update(votes).set({optionId}).where(and(eq(votes.id, voteId))).returning();
        return result[0] ?? null;
    }

    async delete(voteId: string) {
        const result = await db.delete(votes).where(eq(votes.id, voteId)).returning();
        return result[0] ?? null;
    }

    async getResults(pollId: string) {
        const result = await db.select({
            optionId: pollOptions.id,
            option: pollOptions.option,
            voteCount: sql<number>`count(${votes.id})`
        }).from(pollOptions).leftJoin(votes, eq(votes.optionId, pollOptions.id)).where(eq(pollOptions.pollId, pollId)).groupBy(pollOptions.id, pollOptions.option);

        return result;
    }
}