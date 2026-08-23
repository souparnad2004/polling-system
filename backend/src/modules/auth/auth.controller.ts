import type { Request, Response } from "express";
import { PasswordService } from "./password.service.js";
import { AuthService } from "./auth.service.js";
import { SessionService } from "./session.service.js";
import { SESSION_COOKIE_NAME } from "./auth.constants.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error.js";
import { env } from "../../config/env.js";

const passwordService = new PasswordService();
const authService = new AuthService(passwordService);
const sessionService = new SessionService();

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function register(req: Request, res: Response): Promise<void> {
    const user = await authService.register(req.body);
    const session = await sessionService.create(user.id);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
        ...cookieOptions,
        expires: session.expiresAt,
    });
    res.status(201).json({ user });
}

export async function login(req: Request, res: Response): Promise<void> {
    const user = await authService.login(req.body);

    const session = await sessionService.create(user.id);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
        ...cookieOptions,
        expires: session.expiresAt,
    });
    res.status(200).json({ user });
}

export function getCurrentUser(req: Request, res: Response): void {
    if (!req.user) throw new UnauthorizedError();

    res.status(200).json({
        user: req.user,
    });
}

export async function logout(req: Request, res: Response): Promise<void> {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (token) await sessionService.revoke(token);

    res.clearCookie(SESSION_COOKIE_NAME, cookieOptions);

    res.status(204).end();
}