import { apiFetch } from "@/src/lib/api/client";
import { LoginInput } from "../schemas/login.schema";
import { LoginResponse } from "../types/auth.types";

export async function login(data: LoginInput) {
    const response = await apiFetch<LoginResponse>("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
  
    return response.user;
}