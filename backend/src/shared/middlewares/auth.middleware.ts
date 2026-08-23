import type { Request, Response, NextFunction } from "express";

import { SESSION_COOKIE_NAME } from "../../modules/auth/auth.constants.js";
import { SessionService } from "../../modules/auth/session.service.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

const sessionService = new SessionService();

export async function requireAuthentication(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (!token) {
      throw new UnauthorizedError();
    }

    const user = await sessionService.getUserByToken(token);

    if (!user) {
      throw new UnauthorizedError(
        "Invalid or expired token",
        "INVALID_SESSION",
      );
    }

    if (user.status !== "active")
      throw new UnauthorizedError(
        "This account is not active",
        "ACCOUNT_INACTIVE",
      );

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}
