import { apiFetch } from "@/src/lib/api/client";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  status: "active" | "inactive";
  createdAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(
  input: RegisterInput,
): Promise<User> {
  const response = await apiFetch<{ user: User }>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.user;
}

export async function login(
  input: LoginInput,
): Promise<User> {
  const response = await apiFetch<{ user: User }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );

  return response.user;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiFetch<{ user: User }>(
    "/api/auth/me",
  );

  return response.user;
}

export async function logout(): Promise<void> {
  await apiFetch<void>("/api/auth/logout", {
    method: "POST",
  });
}
