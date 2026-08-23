import { AppError } from "./app-error.js";

export class ConflictError extends AppError {
    constructor(message: string, code = "CONFLICT_ERROR") {
        super(message, 409, code);
        this.name = "ConflictError";
    }
}