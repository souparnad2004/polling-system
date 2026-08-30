import type { Request, Response } from "express";
import { SESSION_COOKIE_NAME } from "./auth.constants.js";
import { env } from "../../config/env.js";
import type { AuthService } from "./auth.service.js";
import type { SessionService } from "./session.service.js";

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

type AuthControllerDependencies = {
    authService: AuthService;
    sessionService: SessionService;
};

export function createAuthController({
    authService,
    sessionService,
}: AuthControllerDependencies) {
  async function register(req: Request, res: Response): Promise<void> {
    const user = await authService.register(req.body);
        const session = await sessionService.create(user.id);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
        ...cookieOptions,
        expires: session.expiresAt,
    });
        res.status(201).json({ user });
    }

    async function login(req: Request, res: Response): Promise<void> {
    const user = await authService.login(req.body);

    const session = await sessionService.create(user.id);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
        ...cookieOptions,
        expires: session.expiresAt,
    });
        res.status(200).json({ user });
    }

    async function logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (token) await sessionService.revoke(token);

    res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);

        res.status(204).end();
    }

    return { register, login, logout };
}
