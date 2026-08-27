import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

type RequestSource = "body" | "params" | "query";

export const validate = <T>(
    schema: z.ZodType<T>,
    source: RequestSource = "body"
) =>
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            next(result.error);
            return;
        }

        if (source === "body") {
            req.body = result.data;
        }

        next();
    };