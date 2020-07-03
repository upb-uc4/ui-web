import APIError from "./APIError"

export default interface ValidationError extends APIError {
    errors: {
        name: string;
        reason: string;
    }[];
}