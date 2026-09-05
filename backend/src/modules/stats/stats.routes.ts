import { Router } from "express";

import { createRequireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import type { SessionService } from "../auth/session.service.js";
import { createStatsController } from "./stats.controller.js";
import type { StatsService } from "./stats.service.js";

type StatsRoutesDependencies = {
    statsService: StatsService;
    sessionService: SessionService;
};

export function createStatsRouter({
    statsService,
    sessionService,
}: StatsRoutesDependencies): Router {
    const router: Router = Router();
    const statsController = createStatsController(statsService);
    const requireAuthentication = createRequireAuthentication(sessionService);

    router.get("/overview", requireAuthentication, statsController.getOverview);
    router.get("/polls/:pollId", requireAuthentication, statsController.getPollAnalytics);

    return router;
}