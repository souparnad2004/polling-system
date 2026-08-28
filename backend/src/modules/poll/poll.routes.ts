import { Router } from "express";
import { PollService } from "./poll.service.js";
import { createPollController } from "./poll.controller.js";
import { createRequireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import { SessionService } from "../auth/session.service.js";
import {
  createPollSchema,
  pollIdParamsSchema,
  updatePollSchema,
} from "./poll.schema.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";

type PollRoutesDependencies = {
  pollService: PollService;
  sessionService: SessionService;
};

export function createPollRouter({
  pollService,
  sessionService,
}: PollRoutesDependencies): Router {
  const router: Router = Router();
  const pollController = createPollController(pollService);
  const requireAuthentication = createRequireAuthentication(sessionService);

  router.post(
    "/create",
    requireAuthentication,
    validate(createPollSchema),
    pollController.createPoll,
  );
  router.get(
    "/",
    requireAuthentication,
    pollController.getPolls,
  );
  router.get(
    "/:pollId",
    validate(pollIdParamsSchema, "params"),
    pollController.getPoll,
  );
  router.patch(
    "/:pollId",
    requireAuthentication,
    validate(updatePollSchema),
    validate(pollIdParamsSchema, "params"),
    pollController.updatePoll,
  );
  router.post(
    "/:pollId/publish",
    requireAuthentication,
    validate(pollIdParamsSchema, "params"),
    pollController.publishPoll,
  );
  router.post(
    "/:pollId/close",
    validate(pollIdParamsSchema, "params"),
    requireAuthentication,
    pollController.closePoll,
  );

  router.delete(
    "/:pollId",
    requireAuthentication,
    validate(pollIdParamsSchema, "params"),
    pollController.deletePoll,
  );

  return router;
}
