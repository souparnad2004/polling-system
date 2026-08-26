import cookieParser from "cookie-parser";
import express from "express";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createUserRouter } from "./modules/user/user.routes.js";
import { errorHandler } from "./shared/middlewares/error-handler.middleware.js";
import { dependencies } from "./container.js";
import { NotFoundRoute } from "./shared/middlewares/not-found-route.middlware.js";
import { createPollRouter } from "./modules/poll/poll.routes.js";

export function createApp(appDependencies = dependencies): express.Express {
    const app: express.Express = express();

    app.use(cookieParser());
    app.use(express.json());

    app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
    });

    app.use("/api/auth", createAuthRouter(appDependencies));
    app.use("/api/user", createUserRouter(appDependencies));
    app.use("/api/poll", createPollRouter(appDependencies));

    app.use(NotFoundRoute);
    app.use(errorHandler);

    return app;
}

export default createApp();