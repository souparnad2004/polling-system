import type { User } from "../../infrastructure/database/schema/users.js";

declare global {
    namespace Express{
        interface Request {
            user?: User;
        }
    }
}

export {}