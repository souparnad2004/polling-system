import { db } from "../../database/client.js";
import { ConflictError } from "../../shared/errors/conflict-error.js";
import { ForbiddenError } from "../../shared/errors/forbidden-error.js";
import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { PollRepository } from "./poll.repository.js";
import { CreatePollInput, UpdatePollInput } from "./poll.schema.js";

export class PollService {
    constructor(private readonly pollRepository: PollRepository){}

    async createPoll(userId: string, input: CreatePollInput) {
        return db.transaction(async (tx) => {
            const poll = await this.pollRepository.createPoll(tx, {userId, title: input.title, description: input.description});
            const options = await this.pollRepository.createOptions(tx, {options: input.options, pollId: poll.id});
            return {...poll, options}
        })
    }

    async getPoll(pollId: string, viewerId?: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        const isOwner = viewerId === poll.userId;

        const isPublic = poll.status === "published" || poll.status === "closed";

        // Return 404 (rather than 403) for private polls the viewer doesn't own
        // so private polls are indistinguishable from nonexistent ones.
        if(!isOwner && !isPublic) throw new NotFoundError("poll not found");

        return poll;
    }

    async getPolls(userId: string) {
        return this.pollRepository.findByUserId(userId);
    }

    async updatePoll(pollId: string, userId: string, input: UpdatePollInput) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.userId !== userId) throw new ForbiddenError("You do not own this poll");

        if(poll.status !== "draft") throw new ConflictError("Only draft polls can be edited");

        return db.transaction(async (tx) => {
            if (input.options) {
                await this.pollRepository.deleteOptions(tx, pollId);
                await this.pollRepository.createOptions(tx, {pollId, options: input.options});
            }

            await this.pollRepository.updatePoll(tx, pollId, input);

            const updatedPoll = await this.pollRepository.findById(pollId, tx);

            if (!updatedPoll) throw new NotFoundError("poll not found");

            return updatedPoll;
        })
    }


    async publishPoll(pollId: string, userId: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.userId !== userId) throw new ForbiddenError("You do not own this poll");

        if(poll.status !== "draft") throw new ConflictError("Only draft polls can be published");

        if(poll.options.length < 2 || poll.options.length > 10) throw new ConflictError("Poll must have between 2 and 10 options");

        const published = await this.pollRepository.publishPoll(pollId);

        if(!published) throw new ConflictError("Poll could not be published");

        return published;
    }

    async closePoll(pollId: string, userId: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.userId !== userId) throw new ForbiddenError("You do not own this poll");

        if(poll.status !== "published") throw new ConflictError("Only published polls can be closed");

        const closedPoll = await this.pollRepository.closePoll(pollId);

        if(!closedPoll) throw new ConflictError("Poll could not be closed");

        return closedPoll;
    }

    async deletePoll(pollId: string, userId: string) {
        const poll = await this.pollRepository.findById(pollId);

        if(!poll) throw new NotFoundError("poll not found");

        if(poll.userId !== userId) throw new ForbiddenError("You do not own this poll");

        return this.pollRepository.deletePoll(pollId);
    }
}