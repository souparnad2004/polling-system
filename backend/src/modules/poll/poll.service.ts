import { db } from "../../database/client.js";
import { ForbiddenError } from "../../shared/errors/forbidden-error.js";
import { NotFoundError } from "../../shared/errors/not-found-error.js";
import { PollRepository } from "./poll.repository.js";
import { CreatePollInput } from "./poll.schema.js";

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

        if(!isOwner && !isPublic) throw new ForbiddenError("You can not access this poll");

        return poll;
    }
}