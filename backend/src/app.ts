import express from "express";
import authRouter from "./modules/auth/auth.routes.js";
import { errorHandler } from "./shared/middlewares/error-handler.middleware.js";

const app: express.Express = express();

app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;