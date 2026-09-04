import { and, desc, eq, gte, sql } from "drizzle-orm";

import { db } from "../../infrastructure/database/client.js";
import { polls } from "../../infrastructure/database/schema/polls.js";
import { votes } from "../../infrastructure/database/schema/votes.js";

export class StatsRepository {
    // Status breakdown for the user's polls (draft / published / closed).
    async getPollStatusCounts(userId: string) {
        return db.select({
            status: polls.status,
            count: sql<number>`count(*)::int`,
        }).from(polls).where(eq(polls.userId, userId)).groupBy(polls.status);
    }

    async getVoteMetrics(userId: string) {
        const result = await db.select({
            totalVotes: sql<number>`count(${votes.id})::int`,
            responses: sql<number>`count(distinct coalesce(${votes.userId}, ${votes.voterToken}))::int`,
            respondedPolls: sql<number>`count(distinct ${votes.pollId})::int`,
        }).from(votes).innerJoin(polls, eq(polls.id, votes.pollId)).where(eq(polls.userId, userId));

        return result[0] ?? { totalVotes: 0, responses: 0, respondedPolls: 0 };
    }

    // Votes bucketed by day (UTC) for the user's polls, since the given date.

    async getVoteActivity(userId: string, since: Date) {
        return db.select({
            day: sql<Date>`date_trunc('day', ${votes.createdAt})`,
            count: sql<number>`count(*)::int`,
        }).from(votes).innerJoin(polls, eq(polls.id, votes.pollId))
            .where(and(eq(polls.userId, userId), gte(votes.createdAt, since)))
            .groupBy(sql`date_trunc('day', ${votes.createdAt})`)
            .orderBy(sql`date_trunc('day', ${votes.createdAt}) asc`);
    }


    async getRecentPolls(userId: string, limit: number) {
        return db.select({
            id: polls.id,
            title: polls.title,
            status: polls.status,
            createdAt: polls.createdAt,
            voteCount: sql<number>`count(${votes.id})::int`,
        }).from(polls).leftJoin(votes, eq(votes.pollId, polls.id))
            .where(eq(polls.userId, userId))
            .groupBy(polls.id, polls.title, polls.status, polls.createdAt)

            .orderBy(desc(polls.createdAt))
            .limit(limit);
    }

    // Aggregate metrics for a single poll. Ownership is enforced by filtering
    // on polls.userId, so users can only read analytics for their own polls.
    async getPollMetrics(pollId: string, userId: string) {
        const result = await db.select({
            id: polls.id,
            title: polls.title,
            status: polls.status,
            createdAt: polls.createdAt,
            totalVotes: sql<number>`count(${votes.id})::int`,
            uniqueVoters: sql<number>`count(distinct coalesce(${votes.userId}, ${votes.voterToken}))::int`,
            anonymousVotes: sql<number>`(count(*) filter (where ${votes.userId} is null))::int`,
        }).from(polls).leftJoin(votes, eq(votes.pollId, polls.id))
            .where(and(eq(polls.id, pollId), eq(polls.userId, userId)))
            .groupBy(polls.id, polls.title, polls.status, polls.createdAt);

        return result[0] ?? null;
    }

    // Votes bucketed by day (UTC) for one poll across its whole lifetime.
    async getPollVoteActivity(pollId: string) {
        return db.select({
            day: sql<Date>`date_trunc('day', ${votes.createdAt})`,
            count: sql<number>`count(*)::int`,
        }).from(votes).where(eq(votes.pollId, pollId))
            .groupBy(sql`date_trunc('day', ${votes.createdAt})`)
            .orderBy(sql`date_trunc('day', ${votes.createdAt}) asc`);
    }

    async getRecentVotes(pollId: string, limit: number) {
        return db.select({
            createdAt: votes.createdAt,
            isAnonymous: sql<boolean>`${votes.userId} is null`,
        }).from(votes).where(eq(votes.pollId, pollId))
            .orderBy(desc(votes.createdAt))
            .limit(limit);
    }
}