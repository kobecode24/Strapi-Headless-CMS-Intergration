// src/types/index.ts

// Image format type
export interface ImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: null | string;
    width: number;
    height: number;
    size: number;
    sizeInBytes?: number;
    url: string;
}

// Image type
export interface StrapiImage {
    id: number;
    documentId: string;
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail: ImageFormat;
        small: ImageFormat;
        medium: ImageFormat;
        large?: ImageFormat;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: null | string;
    provider: string;
    provider_metadata: null | Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Author type
export interface Author {
    id: number;
    documentId: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Category type
export interface Category {
    id: number;
    documentId: string;
    name: string;
    slug: string;
    description: null | string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Content block types
export interface ContentBlock {
    __component: string;
    id: number;
    body?: string;
    title?: string;
}

// Article type
export interface Article {
    id: number;
    documentId: string;
    title: string;
    description: string;
    content?: string;
    slug: string;
    featured: boolean | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    cover: StrapiImage | null;
    blocks: ContentBlock[];
    category?: Category;
    author?: Author;
}

// Strapi data structure
export interface StrapiData<T> {
    id: number;
    documentId?: string;
    attributes: T;
}

// Strapi response for collections
export interface StrapiCollectionResponse<T> {
    data: StrapiData<T>[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
}

// Strapi response for single items
export interface StrapiSingleResponse<T> {
    data: StrapiData<T>;
    meta: object
}

// Add this interface
export interface About {
    title: string;
    content: string;
}