import axios from 'axios';
import {
    StrapiCollectionResponse,
    StrapiSingleResponse,
    Article,
    About
} from '../types';
import config from '../config';
import { handleApiError } from '../utils/errorHandling';

// Create axios instance with common configuration
const apiClient = axios.create({
    baseURL: 'http://localhost:1337/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service for Articles
export const ArticleService = {
    // Get all articles
    getAll: async (): Promise<StrapiCollectionResponse<Article>> => {
        try {
            const response = await apiClient.get<StrapiCollectionResponse<Article>>('/articles?populate=*');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get featured articles (latest 3)
    getFeatured: async (): Promise<StrapiCollectionResponse<Article>> => {
        try {
            const response = await apiClient.get<StrapiCollectionResponse<Article>>(
                '/articles?populate=*&sort=createdAt:desc&pagination[limit]=3'
            );
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    // Get a single article by ID
    getById: async (id: string): Promise<StrapiSingleResponse<Article>> => {
        try {
            console.log(`Fetching article with ID: ${id}`);
            const url = `/articles/${id}?populate=*`;
            console.log(`Request URL: ${apiClient.defaults.baseURL}${url}`);
            
            const response = await apiClient.get<StrapiSingleResponse<Article>>(url);
            console.log("Article response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching article:", error);
            console.error("Status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            throw handleApiError(error);
        }
    },

    // Create a new article
    create: async (articleData: any): Promise<StrapiSingleResponse<Article>> => {
        try {
            console.log("Creating article with data:", articleData);
            const response = await apiClient.post<StrapiSingleResponse<Article>>(
                '/articles',
                { data: articleData }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating article:", error);
            throw handleApiError(error);
        }
    },

    // Update an article
    update: async (id: string, articleData: Partial<Article>): Promise<StrapiSingleResponse<Article>> => {
        try {
            const response = await apiClient.put<StrapiSingleResponse<Article>>(
                `/articles/${id}`,
                { data: articleData }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating article:", error);
            throw handleApiError(error);
        }
    },

    // Delete an article
    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/articles/${id}`);
        } catch (error) {
            console.error("Error deleting article:", error);
            throw handleApiError(error);
        }
    },

    // Create article with files
    createWithFiles: async (formData: FormData): Promise<StrapiSingleResponse<Article>> => {
        try {
            console.log("Form data keys:", Array.from(formData.keys()));
            
            // Use fetch API instead of axios, which sometimes has issues with FormData
            const response = await fetch('http://localhost:1337/api/upload', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Upload failed');
            }
            
            const uploadResult = await response.json();
            console.log("Upload result:", uploadResult);
            
            // Now create the article with the uploaded file ID
            const firstUploadedFile = uploadResult[0];
            
            const articleData = JSON.parse(formData.get('data') as string);
            articleData.cover = firstUploadedFile.id;
            
            const articleResponse = await apiClient.post<StrapiSingleResponse<Article>>(
                '/articles',
                { data: articleData }
            );
            
            return articleResponse.data;
        } catch (error: any) {
            console.error("Error creating article with files:", error);
            console.error("Error response:", error.response?.data);
            throw handleApiError(error);
        }
    },

    // Update article with files
    updateWithFiles: async (id: string, formData: FormData): Promise<StrapiSingleResponse<Article>> => {
        try {
            const response = await axios.put<StrapiSingleResponse<Article>>(
                `http://localhost:1337/api/articles/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating article with files:", error);
            throw handleApiError(error);
        }
    },

    // Get related articles
    getRelated: async (id: string): Promise<StrapiCollectionResponse<Article>> => {
        try {
            console.log(`Fetching related articles for ID: ${id}`);
            const url = `/articles/${id}/related`;
            
            const response = await apiClient.get<StrapiCollectionResponse<Article>>(url);
            console.log("Related articles response:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching related articles:", error);
            console.error("Status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            throw handleApiError(error);
        }
    },
};

// API service for About page
export const AboutService = {
    // Get about information
    getInfo: async (): Promise<StrapiSingleResponse<About>> => {
        try {
            const response = await apiClient.get<StrapiSingleResponse<About>>('/about');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },
};

export default {
    ArticleService,
    AboutService,
};