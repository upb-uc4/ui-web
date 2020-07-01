import APIError from '@/api/api_models/errors/APIError';

export default interface APIResponse<T> {
    networkError: boolean;
    statusCode: number;
    returnValue: T;
    error: APIError;
}