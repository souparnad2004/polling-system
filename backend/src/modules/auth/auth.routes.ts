import { Router } from "express";

import { createAuthController } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { createRequireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import { loginRateLimit } from "../../shared/middlewares/rate-limit.middleware.js";
import type { AuthService } from "./auth.service.js";
import type { SessionService } from "./session.service.js";

type AuthRouteDependencies = {
	authService: AuthService;
	sessionService: SessionService;
};

export function createAuthRouter({authService, sessionService}: AuthRouteDependencies): Router {
	const router: Router = Router();
	const controller = createAuthController({authService, sessionService});
	const requireAuthentication = createRequireAuthentication(
		sessionService
	);

	router.post("/register", validate(registerSchema), controller.register);
	router.post("/login", loginRateLimit, validate(loginSchema), controller.login);
	router.post("/logout", requireAuthentication, controller.logout);

	return router;
}