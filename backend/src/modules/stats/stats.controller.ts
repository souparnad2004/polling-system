import type { Request, Response } from "express";

import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error.js";
import type { StatsService } from "./stats.service.js";

export function createStatsController(statsService: StatsService) {
    async function getOverview(req: Request, res: Response) {
        if (!req.user) throw new UnauthorizedError();

        const overview = await statsService.getOverview(req.user.id);

        res.status(200).json({
            overview,
        });
    }

    async function getPollAnalytics(req: Request<{ pollId: string }>, res: Response) {
        if (!req.user) throw new UnauthorizedError();

        const analytics = await statsService.getPollAnalytics(req.params.pollId, req.user.id);

        // Ownership is enforced in the query itself; unknown or foreign polls
        // return 404 so private analytics are indistinguishable from missing.
        if (!analytics) throw new NotFoundError("poll not found");

        res.status(200).json({
            analytics,
        });
    }

    return { getOverview, getPollAnalytics };
}