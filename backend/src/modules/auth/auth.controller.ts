import type { Request, Response } from "express";
import { PasswordService } from "./password.service.js";
import { AuthService } from "./auth.service.js";
import type { RegisterInput } from "./auth.schema.js";

const passwordService = new PasswordService();
const authService = new AuthService(passwordService);

export async function register(req: Request, res: Response): Promise<void> {
    const input = req.body as RegisterInput;
    const user = await authService.register(input);
    res.status(201).json({ user });
}