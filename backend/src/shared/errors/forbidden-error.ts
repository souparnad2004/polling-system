import { AppError } from "./app-error.js";

export class ForbiddenError extends AppError {
    constructor(message: string = "Access forbidden", code = "FORBIDDEN_ERROR") {
        super(message, 403, code);
    }
}