// src/hooks/useArticles.ts
import { useState, useEffect } from 'react';
import { Article, StrapiCollectionResponse, StrapiSingleResponse } from '../types';
import { ArticleService } from '../services/api';
import { ApiError, getUserFriendlyErrorMessage } from '../utils/errorHandling';

export const useFeaturedArticles = () => {
    const [articles, setArticles] = useState<StrapiCollectionResponse<Article> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedArticles = async () => {
            try {
                setLoading(true);
                const data = await ArticleService.getFeatured();
                setArticles(data);
                setError(null);
            } catch (err) {
                const apiError = err as ApiError;
                setError(getUserFriendlyErrorMessage(apiError));
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedArticles();
    }, []);

    return { articles, loading, error };
};

// Add this missing hook
export const useArticles = () => {
    const [articles, setArticles] = useState<StrapiCollectionResponse<Article> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const data = await ArticleService.getAll();
            setArticles(data);
            setError(null);
        } catch (err) {
            const apiError = err as ApiError;
            setError(getUserFriendlyErrorMessage(apiError));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    return { articles, loading, error, refetch: fetchArticles };
};

// Add this hook for single article
export const useArticle = (id: string) => {
    const [article, setArticle] = useState<StrapiSingleResponse<Article> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const data = await ArticleService.getById(id);
                setArticle(data);
                setError(null);
            } catch (err) {
                const apiError = err as ApiError;
                setError(getUserFriendlyErrorMessage(apiError));
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    return { article, loading, error };
};