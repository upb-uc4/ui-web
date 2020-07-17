import APIError from "./APIError";

export default interface ValidationError extends APIError {
    invalidParams: {
        name: string;
        reason: string;
    }[];
}
