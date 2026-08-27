import { VoteService } from "./vote.service.js";
import type { Request, Response } from "express";

const VOTER_TOKEN_COOKIE_NAME = "voterToken";

// The voterToken cookie is how an anonymous voter's identity survives across
// requests (their votes.voter_token row). 30-day expiry keeps returning guests
// able to change/remove their vote without forcing a login.
const VOTER_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 1000 * 60 * 60 * 24 * 30,
};

export function createVoteController(voteService: VoteService) {
    // Identity resolution: an authenticated user always wins and never falls back
    // to the anonymous cookie; otherwise the vote is attributed to the anonymous
    // voter_token from the cookie (if any).
    function resolveVoter(req: Request) {
        if (req.user) {
            return { userId: req.user.id, voterToken: undefined };
        }
        return { userId: undefined, voterToken: req.cookies.voterToken };
    }

    async function castVote(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;
        const { optionId } = req.body;
        const { userId, voterToken } = resolveVoter(req);

        const result = await voteService.createVote(pollId, optionId, userId, voterToken);

        // First-time anonymous voters receive their freshly minted token.
        if (result.voterToken) {
            res.cookie(VOTER_TOKEN_COOKIE_NAME, result.voterToken, VOTER_TOKEN_COOKIE_OPTIONS);
        }

        res.status(201).json({
            vote: result.vote,
        });
    }

    async function changeVote(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;
        const { optionId } = req.body;
        const { userId, voterToken } = resolveVoter(req);

        const vote = await voteService.changeVote(pollId, optionId, userId, voterToken);

        res.status(200).json({
            vote,
        });
    }

    async function removeVote(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;
        const { userId, voterToken } = resolveVoter(req);

        const vote = await voteService.removeVote(pollId, userId, voterToken);

        res.status(200).json({
            vote,
        });
    }

    async function getResult(req: Request<{pollId: string}>, res: Response) {
        const result = await voteService.getResults(req.params.pollId);

        res.status(200).json({
            result,
        });
    }

    return { castVote, changeVote, removeVote, getResult };
}