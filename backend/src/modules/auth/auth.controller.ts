import type { Request, Response } from "express";
import { PasswordService } from "./password.service.js";
import { AuthService } from "./auth.service.js";
import type { RegisterInput } from "./auth.schema.js";
import { SessionService } from "./session.service.js";
import { SESSION_COOKIE_NAME } from "./auth.constants.js";

const passwordService = new PasswordService();
const authService = new AuthService(passwordService);
const sessionService = new SessionService();

export async function register(req: Request, res: Response): Promise<void> {
    const input = req.body as RegisterInput;
    const user = await authService.register(input);
    const session = await sessionService.create(user.id);

    res.cookie(SESSION_COOKIE_NAME, session.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: session.expiresAt,
        path: "/",
    })
    res.status(201).json({ user });
}