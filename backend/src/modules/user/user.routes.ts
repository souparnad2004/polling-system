import { Router } from "express";
import { createUserController } from "./user.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { createRequireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import { updateUserProfileSchema } from "./user.schema.js";
import type { SessionService } from "../auth/session.service.js";
import type { UserService } from "./user.service.js";

type UserRouteDependencies = {
  sessionService: SessionService;
  userService: UserService;
};

export function createUserRouter({
  sessionService,
  userService,
}: UserRouteDependencies): Router {
  const router: Router = Router();
  const userController = createUserController(userService);
  const requireAuthentication = createRequireAuthentication(sessionService);

  router.use(requireAuthentication);

  router.get("/me", userController.getMyProfile);
  router.patch(
    "/me",
    validate(updateUserProfileSchema),
    userController.updateMyProfile,
  );

  return router;
}
