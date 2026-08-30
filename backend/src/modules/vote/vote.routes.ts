import { Router } from "express";
import { VoteService } from "./vote.service.js";
import { createVoteController } from "./vote.controller.js";
import { createVoteSchema, pollIdParamsSchema } from "./vote.schema.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { createOptionalAuthentication } from "../../shared/middlewares/auth.middleware.js";
import type { SessionService } from "../auth/session.service.js";

export type VoteRouterDependencies = {
    voteService: VoteService;
    sessionService: SessionService;
};

export function createVoteRouter({ voteService, sessionService }: VoteRouterDependencies): Router {
    const router: Router = Router();
    const voteController = createVoteController(voteService);
    const optionalAuthentication = createOptionalAuthentication(sessionService);

    // Voting is public on published polls, so these routes are intentionally not
    // behind authentication. Optional session resolution populates req.user when
    // a valid session is present (so authenticated votes are attributed to the
    // account); otherwise the anonymous voterToken cookie resolves the voter.
    router.post(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        validate(createVoteSchema),
        optionalAuthentication,
        voteController.castVote,
    );
    router.patch(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        validate(createVoteSchema),
        optionalAuthentication,
        voteController.changeVote,
    );
    router.delete(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        optionalAuthentication,
        voteController.removeVote,
    );
    router.get(
        "/:pollId/results",
        validate(pollIdParamsSchema, "params"),
        optionalAuthentication,
        voteController.getResult,
    );

    return router;
}