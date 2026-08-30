import { apiClient } from "@/src/lib/api/client";

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

export interface PollResults {
    pollId: string;
    totalVotes: number;
    options: PollResultOption[]
}

export async function getPoll(pollId: string):Promise<Poll> {
    const response = await apiClient<{poll: Poll}>(`/api/polls/${pollId}`);
    return response.poll;
}

export async function getPollResults(pollId: string):Promise<PollResults> {
    const response = await apiClient<{result: PollResults}>(`/api/polls/${pollId}/results`);
    return response.result;
}

export async function createVote(pollId: string, optionId: string) {
    const response = await apiClient<{vote: {id: string}}>(`/api/polls/${pollId}/votes`, {
        method: "POST",
        body: JSON.stringify({
            optionId
        })
    })

    return response.vote;
}

export async function getPolls(): Promise<Poll[]> {
    const response = await apiClient<{polls: Poll[]}>(`/api/polls`);
    return response.polls;
}

export interface CreatePollInput {
  title: string;
  description?: string;
  options: string[];
}

export async function createPoll(
  input: CreatePollInput,
): Promise<Poll> {
  const response = await apiClient<{
    poll: Poll;
  }>("api/polls", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.poll;
}


export interface updatePollInput{
    title?: string;
    description?: string;
}

export async function updatePoll(pollId: string, input: updatePollInput):Promise<Poll> {
    const response = await apiClient<{poll: Poll}>(`api/polls/${pollId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    });

    return response.poll;
}

export async function publishPoll(pollId: string):Promise<Poll> {
    const response = await apiClient<{poll: Poll}>(`api/polls/${pollId}/publish`, {
        method: "POST",
    });

    return response.poll;
}



export async function closePoll(
  pollId: string,
): Promise<Poll> {
  const response = await apiClient<{
    poll: Poll;
  }>(`api/polls/${pollId}/close`, {
    method: "POST",
  });

  return response.poll;
}

export async function deletePoll(
  pollId: string,
): Promise<void> {
  await apiClient<void>(
    `/polls/${pollId}`,
    {
      method: "DELETE",
    },
  );
}