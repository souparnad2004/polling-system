import { StatsRepository } from "./stats.repository.js";

const ACTIVITY_DAYS = 14;
const RECENT_POLL_LIMIT = 6;
const RECENT_VOTE_LIMIT = 8;
const DAY_MS = 24 * 60 * 60 * 1000;

export class StatsService {
    constructor(private readonly statsRepository: StatsRepository) {}

    async getOverview(userId: string) {
        const since = new Date(Date.now() - ACTIVITY_DAYS * DAY_MS);

        const [statusCounts, voteMetrics, activityRows, recentPolls] = await Promise.all([
            this.statsRepository.getPollStatusCounts(userId),
            this.statsRepository.getVoteMetrics(userId),
            this.statsRepository.getVoteActivity(userId, since),
            this.statsRepository.getRecentPolls(userId, RECENT_POLL_LIMIT),
        ]);

        const totalPolls = statusCounts.reduce((sum, row) => sum + Number(row.count), 0);
        const totalVotes = Number(voteMetrics.totalVotes ?? 0);
        const responses = Number(voteMetrics.responses ?? 0);
        const respondedPolls = Number(voteMetrics.respondedPolls ?? 0);
        const engagementRate = totalPolls === 0 ? 0 : (respondedPolls / totalPolls) * 100;

        return {
            metrics: {
                totalPolls,
                totalVotes,
                responses,
                respondedPolls,
                engagementRate,
            },
            activity: this.fillActivityGaps(activityRows, ACTIVITY_DAYS),
            recentPolls,
        };
    }

    // Fills any missing days with zero counts so the chart always renders a
    // continuous UTC-based day series (newest day is the last entry).

    private fillActivityGaps(
        rows: { day: Date; count: number }[],
        daysBack: number,
    ): { date: string; count: number }[] {
        const countsByDay = new Map<string, number>();

        for (const row of rows) {
            const key = new Date(row.day).toISOString().slice(0, 10);
            countsByDay.set(key, Number(row.count));
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const activity: { date: string; count: number }[] = [];

        for (let i = daysBack - 1; i >= 0; i--) {
            const day = new Date(today.getTime() - i * DAY_MS);
            const key = day.toISOString().slice(0, 10);
            activity.push({ date: key, count: countsByDay.get(key) ?? 0 });
        }

        return activity;
    }

    // Per-poll analytics for the owner. Returns null when the poll does not
    // exist or is not owned by the requesting user (mapped to 404 upstream).
    async getPollAnalytics(pollId: string, userId: string) {
        const [metrics, activityRows, recentVotes] = await Promise.all([
            this.statsRepository.getPollMetrics(pollId, userId),
            this.statsRepository.getPollVoteActivity(pollId),
            this.statsRepository.getRecentVotes(pollId, RECENT_VOTE_LIMIT),
        ]);

        if (!metrics) return null;

        const responses = Number(metrics.totalVotes ?? 0);
        const uniqueVoters = Number(metrics.uniqueVoters ?? 0);
        const anonymousVotes = Number(metrics.anonymousVotes ?? 0);

        const daily = activityRows.map((row) => ({
            date: new Date(row.day).toISOString().slice(0, 10),
            count: Number(row.count),
        }));

        // Running total so the chart shows cumulative responses over time.
        let runningTotal = 0;
        const timeline = daily.map((point) => {
            runningTotal += point.count;
            return { ...point, cumulative: runningTotal };
        });

        return {
            poll: {
                id: metrics.id,
                title: metrics.title,
                status: metrics.status,
                createdAt: metrics.createdAt,
            },
            totals: {
                responses,
                uniqueVoters,
                anonymousVotes,
                anonymousShare: responses === 0 ? 0 : (anonymousVotes / responses) * 100,
            },
            timeline,
            recentVotes,
        };
    }
}