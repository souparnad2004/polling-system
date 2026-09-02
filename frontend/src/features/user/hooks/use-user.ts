"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyProfile } from "../api/user.api";

export const userKeys = {
  all: ["users"] as const,

  me: () => [...userKeys.all, "me"] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyProfile,

    retry: false,

    staleTime: 5 * 60 * 1000,
  });
}