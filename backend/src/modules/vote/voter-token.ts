import { randomUUID } from "node:crypto";

// Returns a UUID v4 (the votes.voter_token column is a uuid type). The token
// identifies an anonymous voter across requests (stored in an httpOnly cookie)
// and is unique per poll via the votes_poll_id_voter_token_unique constraint.
export function generateVoterToken(): string {
    return randomUUID();
}