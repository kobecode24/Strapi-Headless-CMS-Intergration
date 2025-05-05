import { useState, useEffect } from 'react';
import { StrapiSingleResponse, About } from '../types';
import { AboutService } from '../services/api';
import { ApiError, getUserFriendlyErrorMessage } from '../utils/errorHandling';

// Hook for fetching about page information
export const useAbout = () => {
    const [about, setAbout] = useState<StrapiSingleResponse<About> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutInfo = async () => {
            try {
                setLoading(true);
                const data = await AboutService.getInfo();
                setAbout(data);
                setError(null);
            } catch (err) {
                const apiError = err as ApiError;
                setError(getUserFriendlyErrorMessage(apiError));
            } finally {
                setLoading(false);
            }
        };

        fetchAboutInfo();
    }, []);

    return { about, loading, error };
};