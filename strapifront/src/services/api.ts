import axios from 'axios';
import {
    StrapiCollectionResponse,
    StrapiSingleResponse,
    Article,
    About
} from '../types';
import { handleApiError } from '../utils/errorHandling';

// Article update/create data type
export interface ArticleInputData {
    title: string;
    description: string;
    slug: string;
    cover?: { id: number } | number;
    category?: number | { id: number } | null;
    [key: string]: any;
}

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
            
            // Make sure we're using a clean ID (no trailing spaces, etc.)
            const cleanId = id.trim();
            const url = `/articles/${cleanId}?populate=*`;
            
            console.log(`Request URL: ${apiClient.defaults.baseURL}${url}`);
            
            // Add timeout and extra error handling
            const response = await apiClient.get<StrapiSingleResponse<Article>>(url, {
                timeout: 10000, // 10 second timeout
            });
            
            console.log("Article response:", response.data);
            
            // Validate the response data
            if (!response.data || !response.data.data) {
                throw new Error('Invalid response format from API');
            }
            
            return response.data;
        } catch (error: unknown) {
            console.error("Error fetching article:", error);

            if (axios.isAxiosError(error)) {
                console.error("Status:", error.response?.status);
                console.error("Error data:", error.response?.data);

                // Enhanced error for debugging
                if (error.response?.status === 404) {
                    console.error(`Article with ID ${id} not found in the database`);
                    throw new Error(`Article with ID ${id} not found`);
                }
            }

            throw handleApiError(error);
        }
    },

    // Create a new article
    create: async (articleData: ArticleInputData): Promise<StrapiSingleResponse<Article>> => {
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
    update: async (id: string, articleData: ArticleInputData): Promise<StrapiSingleResponse<Article>> => {
        try {
            console.log("API Service: Updating article with ID:", id);
            console.log("API Service: Update data:", JSON.stringify(articleData, null, 2));
            
            // Check if the ID looks like a documentId (contains letters)
            const isDocumentId = /[a-zA-Z]/.test(id);
            
            let endpoint;
            if (isDocumentId) {
                console.log("API Service: Using documentId endpoint for update");
                endpoint = `/articles/document/${id}`;
            } else {
                console.log("API Service: Using numeric ID endpoint for update");
                endpoint = `/articles/${id}`;
            }
            
            // For updates, the API expects a simpler format
            const response = await apiClient.put<StrapiSingleResponse<Article>>(
                endpoint,
                { data: articleData }
            );
            
            console.log("API Service: Update response:", response.status, response.statusText);
            return response.data;
        } catch (error: unknown) {
            console.error("API Service: Error updating article:", error);

            if (axios.isAxiosError(error)) {
                console.error("API Service: Error status:", error.response?.status);
                console.error("API Service: Error data:", JSON.stringify(error.response?.data, null, 2));
            }

            throw handleApiError(error);
        }
    },

    // Delete an article
    delete: async (documentId: string): Promise<void> => {
        try {
            await apiClient.delete(`/articles/${documentId}`);
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
        } catch (error: unknown) {
            console.error("Error creating article with files:", error);
            if (axios.isAxiosError(error)) {
                console.error("Error response:", error.response?.data);
            }
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
        } catch (error: unknown) {
            console.error("Error fetching related articles:", error);
            if (axios.isAxiosError(error)) {
                console.error("Status:", error.response?.status);
                console.error("Error data:", error.response?.data);
            }
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