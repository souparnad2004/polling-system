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

    async function getPoll(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;

        // Public polls can be viewed by anyone; drafts are only accessible to
        // their owner. Ownership/visibility is enforced in pollService.
        const poll = await pollService.getPoll(pollId, req.user?.id);
    
        res.status(200).json({
            poll
        })
    }

    async function getPolls(req: Request, res: Response) {
        if(!req.user) throw new UnauthorizedError();

        const polls = await pollService.getPolls(req.user.id);

        res.status(200).json({
            polls
        });
    }

    async function updatePoll(req: Request<{pollId: string}>, res: Response) {
        const {pollId} = req.params;
        if(!req.user) throw new UnauthorizedError();

        const updatedPoll = await pollService.updatePoll(pollId, req.user.id, req.body);

        res.status(200).json({
            updatedPoll
        })
    }


    async function publishPoll(req: Request<{pollId: string}>, res: Response) {
        const {pollId} = req.params;
        if(!req.user) throw new UnauthorizedError();

        const publishedPoll = await pollService.publishPoll(pollId, req.user.id);

        res.status(200).json({
            publishedPoll
        })
    }

    async function closePoll(req: Request<{pollId: string}>, res: Response) {
        const {pollId} = req.params;
        if(!req.user) throw new UnauthorizedError();

        const closedPoll = await pollService.closePoll(pollId, req.user.id);

        res.status(200).json({
            closedPoll
        })
    }

    async function deletePoll(req: Request<{pollId: string}>, res: Response) {
        const {pollId} = req.params;
        if(!req.user) throw new UnauthorizedError();
        
        await pollService.deletePoll(pollId, req.user.id);

        res.status(200).json({
            message: "Poll deleted Successfully"
        })
    }

    return {createPoll, getPolls, getPoll, updatePoll, publishPoll, closePoll, deletePoll};
}