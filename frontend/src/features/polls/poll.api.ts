import { apiFetch } from "@/src/lib/api/client";

export interface PollOption {
    id: string;
    text: string;
}

export interface Poll {
    id: string;
    title: string;
    description?: string;
    status: "published" | "draft" | "closed";
    options: PollOption[];
}

export interface PollResultOption {
    optionId: string;
    option: string;
    voteCount: number;
}

export interface PollResult {
    pollId: string;
    totalVotes: number;
    options: PollResultOption[]
}

export async function getPoll(pollId: string):Promise<Poll> {
    const response = await apiFetch<{poll: Poll}>(`/api/polls/${pollId}`);
    return response.poll;
}

export async function getPollResults(pollId: string):Promise<PollResult> {
    const response = await apiFetch<{result: PollResult}>(`/api/polls/${pollId}/results`);
    return response.result;
}

export async function createVote(pollId: string, optionId: string) {
    const response = await apiFetch<{vote: {id: string}}>(`/api/polls/${pollId}/votes`, {
        method: "POST",
        body: JSON.stringify({
            optionId
        })
    })

    return response.vote;
}

export async function getPolls(): Promise<Poll[]> {
    const response = await apiFetch<{polls: Poll[]}>(`/api/polls`);
    return response.polls;
}