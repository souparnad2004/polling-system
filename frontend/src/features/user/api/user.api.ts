import { apiClient } from "@/src/lib/api/client";

import type { UpdateProfileInput } from "../schemas/update-profile.schema";
import type { User, UserResponse } from "../types/user.types";

export async function getMyProfile(): Promise<User> {
  const response = await apiClient<UserResponse>("/api/users/me");

  return response.user;
}

export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<User> {
  const response = await apiClient<UserResponse>("/api/users/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return response.user;
}