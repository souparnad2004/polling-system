import { randomBytes } from "node:crypto";

export function generateVoterToken(): string {
    return randomBytes(32).toString("base64url");
}