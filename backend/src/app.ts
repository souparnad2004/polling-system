import express from "express";

const app:express.Express = express();

app.get("/health", (_req, res) => {
    res.json({status: "ok"});
})

export default app;