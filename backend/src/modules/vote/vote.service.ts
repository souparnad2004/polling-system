import { z } from "zod";
import { ConflictError } from "../../shared/errors/conflict-error.js";
import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error.js";
import { PollRepository } from "../poll/poll.repository.js";
import { VoteRepository } from "./vote.repository.js";
import { generateVoterToken } from "./voter-token.js";
import { WebSocketManager } from "../../infrastructure/websocket/websocket-manager.js";

// votes.voter_token is a uuid column; validating the cookie value here keeps
// malformed tokens away from VoteRepository.findByVoter, where a bad UUID
// would surface as a Postgres 22P02 error (500) instead of a clean 400.
const voterTokenSchema = z.uuid();

export class VoteService {
    constructor(private readonly pollRepository: PollRepository, private readonly voteRepository: VoteRepository, private readonly webSocketManager: WebSocketManager) {}

    // Throws the established validation error (zod -> 400 VALIDATION_ERROR via
    // the global error handler) when a provided voterToken is present but not a
    // valid UUID. Absent tokens are allowed here (callers decide what that means).
    private assertValidVoterToken(voterToken?: string): void {
        if (voterToken === undefined) return;
        const parsed = voterTokenSchema.safeParse(voterToken);
        if (!parsed.success) throw parsed.error;
    }

    // Resolves the anonymous identity for a first vote: reuse a valid
    // pre-existing token when present, otherwise mint a fresh token. Verified
    // after poll/option checks so only eligible requests generate new tokens.
    private resolveAnonymousToken(voterToken?: string): string {
        if (voterToken !== undefined && voterTokenSchema.safeParse(voterToken).success) {
            return voterToken;
        }
        return generateVoterToken();
    }

    // Polls with allowAnonymous = false enforce one vote per voter via the
    // authenticated (poll_id, user_id) unique; anonymous voterToken votes are
    // rejected there, matching the poll's vote policy.
    private assertVotingAllowed(poll: {allowAnonymous: boolean}, userId?: string): void {
        if (!poll.allowAnonymous && !userId) {
            throw new UnauthorizedError("Login required to vote on this poll");
        }
    }

    async createVote(pollId: string, optionId: string, userId?: string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Only published polls can be voted on");

        this.assertVotingAllowed(poll, userId);

        const option = poll.options.find((option) => option.id === optionId);

        if(!option) throw new NotFoundError("option does not belong to this poll");

        // Anonymous voters reuse a valid cookie token when present; an absent or
        // malformed token gets a freshly generated one on their first vote.
        // Authenticated voters are identified by user_id and never use the token.
        const token = userId ? undefined : this.resolveAnonymousToken(voterToken);

        const existing = await this.voteRepository.findByVoter(pollId, userId, token);

        if(existing) throw new ConflictError("You have already voted on this poll");

        const vote = await this.voteRepository.create({
            pollId,
            optionId,
            userId,
            voterToken: userId ? undefined : token,
        });

        const results = await this.getResults(pollId);

        // Push the complete, freshly recomputed results to every client
        // subscribed to this poll.
        this.webSocketManager.broadcastPollResult(results.pollId, results);

        return { vote, voterToken: userId ? undefined : token };
    }

    async changeVote(pollId: string, optionId: string, userId?:string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Only published polls can be voted on");

        this.assertVotingAllowed(poll, userId);

        const option = poll.options.find((option) => option.id === optionId);

        if(!option) throw new NotFoundError("option does not belong to this poll");

        // An anonymous change is only findable by its (valid) token; reject
        // malformed cookie values before they reach the repository.
        if(!userId) this.assertValidVoterToken(voterToken);

        const vote = await this.voteRepository.findByVoter(pollId, userId, voterToken);

        if(vote && vote.optionId === optionId) throw new ConflictError("You have already voted for this option");

        if(!vote) throw new NotFoundError("vote not found");

        const result = await this.voteRepository.updateOption(vote.id, optionId);

        const results = await this.getResults(pollId);

        // Push the complete, freshly recomputed results to every client
        // subscribed to this poll.
        this.webSocketManager.broadcastPollResult(results.pollId, results);

        return result;
    }
    
    async removeVote(pollId: string, userId?: string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Poll is not accepting voting changes");

        this.assertVotingAllowed(poll, userId);

        // Same reasoning as changeVote: a malformed anonymous token must not
        // reach the repository lookup.
        if(!userId) this.assertValidVoterToken(voterToken);

        const vote = await this.voteRepository.findByVoter(pollId, userId, voterToken);

        if(!vote) throw new NotFoundError("vote not found");

        const result = await this.voteRepository.delete(vote.id);

        const results = await this.getResults(pollId);

        // Push the complete, freshly recomputed results to every client
        // subscribed to this poll.
        this.webSocketManager.broadcastPollResult(results.pollId, results);

        return result;
    }

    async getResults(pollId: string, viewerId?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        // Match PollService.getPoll visibility: published/closed polls are
        // public; draft results are only visible to the authenticated owner.
        const isOwner = viewerId === poll.userId;
        const isPublic = poll.status === "published" || poll.status === "closed";

        if(!isOwner && !isPublic) throw new NotFoundError("poll not found");

        const options = await this.voteRepository.getResults(pollId);

        const optionsWithCounts = options.map((option) => ({
            optionId: option.optionId,
            option: option.option,
            voteCount: Number(option.voteCount)
        }));

        const totalVotes = optionsWithCounts.reduce((total, option) => total + option.voteCount, 0);

        return {
            pollId,
            totalVotes,
            options: optionsWithCounts
        }
    }

}