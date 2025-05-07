import axios, { AxiosError } from 'axios';

// Custom error type for API errors
export interface ApiError {
    status: number;
    message: string;
    details?: unknown;
}

// Function to handle API errors in a consistent way
export const handleApiError = (error: unknown): ApiError => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        // Handle Strapi-specific error format
        if (axiosError.response?.data &&
            typeof axiosError.response.data === 'object' &&
            'error' in axiosError.response.data) {
            const strapiError = axiosError.response.data.error as {
                status: number;
                name: string;
                message: string;
                details?: unknown;
            };

            return {
                status: strapiError.status || axiosError.response?.status || 500,
                message: strapiError.message || 'An unknown error occurred',
                details: strapiError.details,
            };
        }

        // Handle general Axios errors
        return {
            status: axiosError.response?.status || 500,
            message: axiosError.message || 'An unknown error occurred',
            details: axiosError.response?.data,
        };
    }

    // Handle unknown errors
    return {
        status: 500,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
    };
};

// Helper function to display user-friendly error messages
export const getUserFriendlyErrorMessage = (error: ApiError): string => {
    switch (error.status) {
        case 400:
            return 'The request was invalid. Please check your input and try again.';
        case 401:
            return 'You need to be logged in to access this content.';
        case 403:
            return 'You don\'t have permission to access this content.';
        case 404:
            return 'The requested content could not be found.';
        case 500:
            return 'The server encountered an error. Please try again later.';
        default:
            return error.message || 'An unknown error occurred.';
    }
};