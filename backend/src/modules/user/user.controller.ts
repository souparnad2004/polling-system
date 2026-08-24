import type { Request, Response } from "express";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error.js";
import type { UserService } from "./user.service.js";

export function createUserController(userService: UserService) {
    async function getMyProfile(req: Request, res: Response) {
    if(!req.user) throw new UnauthorizedError();

    const user = await userService.getProfile(req.user.id);

    if(!user) {
        throw new UnauthorizedError();
    }
    
    res.status(200).json({user});
    }

    async function updateMyProfile(req: Request, res: Response) {
    if(!req.user) throw new UnauthorizedError();

    const user = await userService.updateProfile(req.user.id, req.body);

    if(!user) throw new UnauthorizedError();

    res.status(200).json({user});
    }

    return { getMyProfile, updateMyProfile };
}
