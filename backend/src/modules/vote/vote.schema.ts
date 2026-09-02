import { z } from "zod";

export const createVoteSchema = z.object({
    optionId: z.uuid(),
});

export type CreateVoteInput = z.infer<typeof createVoteSchema>;

export const pollIdParamsSchema = z.object({
    pollId: z.uuid(),
});

