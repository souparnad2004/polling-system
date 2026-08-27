import { db } from "../../database/client.js";
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
}