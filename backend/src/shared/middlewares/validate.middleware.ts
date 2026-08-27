import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

export const validate = <T>(schema: z.ZodType<T>) =>
    async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            next(result.error);
            return;
        }

        req.body = result.data;
        next();
    };