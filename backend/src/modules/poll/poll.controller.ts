import type { Request, Response } from "express";
import { PollService } from "./poll.service.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error.js";
import type { CreatePollInput } from "./poll.schema.js";

export function createPollController(pollService: PollService) {
    async function createPoll(req: Request, res: Response) {
        if(!req.user) throw new UnauthorizedError();

        const poll = await pollService.createPoll(req.user.id, req.body as CreatePollInput);
    
        res.status(201).json({
            poll
        })
    }

    return {createPoll};
}