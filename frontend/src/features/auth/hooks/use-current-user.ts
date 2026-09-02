"use client";

export const authKeys = {
    all: ["auth"] as const,

    me:() => [...authKeys.all, "me"] as const
}


import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/auth.api";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,

    retry: false,

    staleTime: 5 * 60 * 1000,
  });
}