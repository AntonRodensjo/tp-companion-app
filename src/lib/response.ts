export interface Response {
    error?: boolean;
    message?: string;
    data?: unknown;
}

export function error(message?: string) {
    const response: Response = { error: true };

    if (message) {
        response.message = message;
    }

    return response;
}
