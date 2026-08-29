import { apiFetch } from "@/src/lib/api/client";
import { RegisterInput } from "../schemas/register.schema";
import { RegisterResponse } from "../types/auth.types";

export async function register(data: RegisterInput){
    const response = await apiFetch<RegisterResponse>("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response.user;
}