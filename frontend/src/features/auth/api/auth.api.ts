import { apiClient } from "@/lib/api/client";
import { LoginInput } from "../schemas/login.schema";
import { LoginResponse, RegisterResponse, User } from "../types/auth.types";
import { RegisterInput } from "../schemas/register.schema";

export async function login(data: LoginInput) {
    const response = await apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
  
    return response.user;
}

export async function register(data: RegisterInput){
    const response = await apiClient<RegisterResponse>("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response.user;
}

export async function getCurrentUser() {
    const response = await apiClient<{user: User}>("/api/users/me");

    return response.user;
}