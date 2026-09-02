import type { Request, Response, NextFunction } from "express";

import { SESSION_COOKIE_NAME } from "../../modules/auth/auth.constants.js";
import type { SessionService } from "../../modules/auth/session.service.js";
import type { User } from "../../infrastructure/database/schema/users.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

// Resolves the active user for a valid session cookie, or throws the usual
// UnauthorizedError variants (missing/invalid/inactive session). Shared by the
// required and optional authentication middlewares.
async function resolveSessionUser(
  sessionService: SessionService,
  req: Request,
): Promise<User> {
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

  return user;
}

export function createRequireAuthentication(sessionService: SessionService) {
  return async function requireAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      req.user = await resolveSessionUser(sessionService, req);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Optional authentication: populates req.user when a valid session exists but
// never rejects anonymous requests. It is used on public routes (poll view,
// voting/results) so identity-aware behavior (owner-only drafts, authenticated
// votes) can rely on req.user without blocking anonymous clients.
export function createOptionalAuthentication(sessionService: SessionService) {
  return async function optionalAuthentication(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      req.user = await resolveSessionUser(sessionService, req);
    } catch {
      // Anonymous continues; a failed session must never break public routes.
    }
    next();
  };
}
