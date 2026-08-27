import { Router } from "express";
import { PollService } from "./poll.service.js";
import { createPollController } from "./poll.controller.js";
import { createRequireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import { SessionService } from "../auth/session.service.js";
import { createPollSchema } from "./poll.schema.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

type PollRoutesDependencies = {
    pollService: PollService,
    sessionService: SessionService
}

export function createPollRouter({pollService ,sessionService}: PollRoutesDependencies):Router {
    const router:Router = Router();
    const pollController = createPollController(pollService);
    const requireAuthentication = createRequireAuthentication(sessionService);

    router.use(requireAuthentication);
    router.post("/create", validate(createPollSchema), pollController.createPoll);

    return router;
}