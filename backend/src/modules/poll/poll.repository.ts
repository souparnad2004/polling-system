import { db } from "../../database/client.js";
import { pollOptions } from "../../database/schema/pollOptions.js";
import { polls } from "../../database/schema/polls.js";

export type DatabaseTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class PollRepository  {
    async createPoll(tx: DatabaseTransaction, input: {userId: string; title: string; description?: string}) {
        const [result] = await tx.insert(polls).values({
            userId: input.userId,
            title: input.title,
            description: input.description,
        }).returning();

        return result;
    }

    async createOptions(tx: DatabaseTransaction, input: {pollId: string; options: string[]}) {
        return tx.insert(pollOptions).values(
            input.options.map((option, position) => ({
                pollId: input.pollId,
                option,
                position                
            }))
        ).returning()
    }
}