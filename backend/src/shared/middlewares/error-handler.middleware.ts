import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation error",
                details: err.flatten(),
            },
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                details: null,
            },
        });
        return;
    }

    console.error("[UnhandledError]", err);
    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            details: null,
        },
    });
};