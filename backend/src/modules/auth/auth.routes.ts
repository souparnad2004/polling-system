import { Router } from "express";

import { getCurrentUser, logout, register } from "./auth.controller.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { registerSchema } from "./auth.schema.js";
import { requireAuthentication } from "../../shared/middlewares/auth.middleware.js";

const router: Router = Router();

router.post("/register", validate(registerSchema), register);
router.get("/me", requireAuthentication, getCurrentUser);
router.post("/logout", requireAuthentication, logout);

export default router;