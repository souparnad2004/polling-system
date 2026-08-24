import { AppError } from "./app-error.js"; 

export class NotFoundError extends AppError {
    constructor(message = "Resource not found", code ="NOT FOUND") {
        super(message, 404, code);
    }
}