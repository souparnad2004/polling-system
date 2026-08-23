import { Router } from "express";

import { getCurrentUser, login, logout, register } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { requireAuthentication } from "../../shared/middlewares/auth.middleware.js";
import { loginRateLimit } from "../../shared/middlewares/rate-limit.middleware.js";

const router: Router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", loginRateLimit,  validate(loginSchema), login);
router.get("/me", requireAuthentication, getCurrentUser);
router.post("/logout", requireAuthentication, logout);

export default router;