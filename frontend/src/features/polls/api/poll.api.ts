import { apiClient } from "@/lib/api/client";
import type {
  CreatePollInput,
  Poll,
  PollAnalytics,
  PollResults,
  UpdatePollInput,
} from "../types/poll.types";

export async function getPoll(pollId: string): Promise<Poll> {
  const response = await apiClient<{ poll: Poll }>(`/api/polls/${pollId}`);
  return response.poll;
}

export async function getPollResults(pollId: string): Promise<PollResults> {
  const response = await apiClient<{ result: PollResults }>(
    `/api/polls/${pollId}/results`,
  );
  return response.result;
}

export async function getPollAnalytics(pollId: string): Promise<PollAnalytics> {
  const response = await apiClient<{ analytics: PollAnalytics }>(
    `/api/stats/polls/${pollId}`,
  );
  return response.analytics;
}

export async function createVote(pollId: string, optionId: string) {
  const response = await apiClient<{ vote: { id: string } }>(
    `/api/polls/${pollId}/votes`,
    {
      method: "POST",
      body: JSON.stringify({ optionId }),
    },
  );

  return response.vote;
}

export async function getPolls(): Promise<Poll[]> {
  const response = await apiClient<{ polls: Poll[] }>(`/api/polls`);
  return response.polls;
}

export async function createPoll(input: CreatePollInput): Promise<Poll> {
  const response = await apiClient<{ poll: Poll }>(`/api/polls/create`, {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.poll;
}

export async function updatePoll(
  pollId: string,
  input: UpdatePollInput,
): Promise<Poll> {
  const response = await apiClient<{ updatedPoll: Poll }>(
    `/api/polls/${pollId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );

  return response.updatedPoll;
}

export async function publishPoll(pollId: string): Promise<Poll> {
  const response = await apiClient<{ publishedPoll: Poll }>(
    `/api/polls/${pollId}/publish`,
    {
      method: "POST",
    },
  );

  return response.publishedPoll;
}

export async function closePoll(pollId: string): Promise<Poll> {
  const response = await apiClient<{ closedPoll: Poll }>(
    `/api/polls/${pollId}/close`,
    {
      method: "POST",
    },
  );

  return response.closedPoll;
}

export async function deletePoll(pollId: string): Promise<void> {
  await apiClient<void>(`/api/polls/${pollId}`, {
    method: "DELETE",
  });
}
