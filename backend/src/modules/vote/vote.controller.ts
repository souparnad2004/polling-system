import { VoteService } from "./vote.service.js";
import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import type { Vote } from "../../infrastructure/database/schema/votes.js";

const VOTER_TOKEN_COOKIE_NAME = "voterToken";

// The voterToken cookie is how an anonymous voter's identity survives across
// requests (their votes.voter_token row). 30-day expiry keeps returning guests
// able to change/remove their vote without forcing a login. The Secure flag is
// enabled only in production so local (HTTP) development keeps working.
const VOTER_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: env.NODE_ENV === "production",
};

// The anonymous identity is only ever exposed through the Set-Cookie response;
// the JSON body must never leak voterToken back to the client. Returns a public
// vote DTO with the voterToken field stripped.
function toPublicVote(vote: Vote | null) {
    if (!vote) return vote;
    const { voterToken: _voterToken, ...publicVote } = vote;
    void _voterToken;
    return publicVote;
}

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
            vote: toPublicVote(result.vote),
        });
    }

    async function changeVote(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;
        const { optionId } = req.body;
        const { userId, voterToken } = resolveVoter(req);

        const vote = await voteService.changeVote(pollId, optionId, userId, voterToken);

        res.status(200).json({
            vote: toPublicVote(vote),
        });
    }

    async function removeVote(req: Request<{pollId: string}>, res: Response) {
        const { pollId } = req.params;
        const { userId, voterToken } = resolveVoter(req);

        const vote = await voteService.removeVote(pollId, userId, voterToken);

        res.status(200).json({
            vote: toPublicVote(vote),
        });
    }

    async function getResult(req: Request<{pollId: string}>, res: Response) {
        // viewerId (from optional auth) lets the service keep draft results
        // private to the authenticated owner, like PollService.getPoll.
        const result = await voteService.getResults(req.params.pollId, req.user?.id);

        res.status(200).json({
            result,
        });
    }

    return { castVote, changeVote, removeVote, getResult };
}