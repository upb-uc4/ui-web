import APIError from "./APIError";
import Error from "./Error";

export default interface ValidationError extends APIError {
    invalidParams: Error[];
}
