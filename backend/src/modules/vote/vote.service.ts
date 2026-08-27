import { ConflictError } from "../../shared/errors/conflict-error.js";
import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { PollRepository } from "../poll/poll.repository.js";
import { VoteRepository } from "./vote.repository.js";
import { generateVoterToken } from "./voter-token.js";

export class VoteService {
    constructor(private readonly pollRepository: PollRepository, private readonly voteRepository: VoteRepository) {}

    async createVote(pollId: string, optionId: string, userId?: string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Only published polls can be voted on");

        const option = poll.options.find((option) => option.id === optionId);

        if(!option) throw new NotFoundError("option does not belong to this poll");

        const existing = await this.voteRepository.findByVoter(pollId, userId, voterToken);

        if(existing) throw new ConflictError("You have already voted on this poll");

        // Anonymous voters get a fresh token on their first vote; the controller
        // stores it in a cookie so later changes/removals can find this row.
        const token = voterToken ?? generateVoterToken();

        const vote = await this.voteRepository.create({
            pollId,
            optionId,
            userId,
            voterToken: userId ? undefined : token,
        });

        return { vote, voterToken: userId ? undefined : token };
    }

    async changeVote(pollId: string, optionId: string, userId?:string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Only published polls can be voted on");

        const option = poll.options.find((option) => option.id === optionId);

        if(!option) throw new NotFoundError("option does not belong to this poll");

        const vote = await this.voteRepository.findByVoter(pollId, userId, voterToken);

        if(vote && vote.optionId === optionId) throw new ConflictError("You have already voted for this option");

        if(!vote) throw new NotFoundError("vote not found");

        return this.voteRepository.updateOption(vote.id, optionId);
    }
    
    async removeVote(pollId: string, userId?: string, voterToken?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.status !== "published") throw new ConflictError("Poll is not accepting voting changes");

        const vote = await this.voteRepository.findByVoter(pollId, userId, voterToken);

        if(!vote) throw new NotFoundError("vote not found");

        return this.voteRepository.delete(vote.id);
    }

    async getResults(pollId: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

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