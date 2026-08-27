import { Router } from "express";
import { VoteService } from "./vote.service.js";
import { createVoteController } from "./vote.controller.js";
import { createVoteSchema, pollIdParamsSchema } from "./vote.schema.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

export type VoteRouterDependencies = {
    voteService: VoteService;
};

export function createVoteRouter({ voteService }: VoteRouterDependencies): Router {
    const router: Router = Router();
    const voteController = createVoteController(voteService);

    // Voting is public on published polls, so these routes are intentionally not
    // behind authentication. Identity is resolved from the session (user_id) when
    // present, otherwise from the anonymous voterToken cookie.
    router.post(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        validate(createVoteSchema),
        voteController.castVote,
    );
    router.patch(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        validate(createVoteSchema),
        voteController.changeVote,
    );
    router.delete(
        "/:pollId/votes",
        validate(pollIdParamsSchema, "params"),
        voteController.removeVote,
    );
    router.get(
        "/:pollId/results",
        validate(pollIdParamsSchema, "params"),
        voteController.getResult,
    );

    return router;
}