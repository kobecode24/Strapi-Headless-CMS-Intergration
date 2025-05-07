import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArticleService } from '../services/api';
import axios from "axios";

interface ArticleFormProps {
    mode: 'create' | 'edit';
}

const ArticleForm: React.FC<ArticleFormProps> = ({ mode }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        slug: '',
        category: ''
    });
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [documentId, setDocumentId] = useState<string | null>(null);

    // If editing, fetch the existing article data
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchArticle = async () => {
                try {
                    setLoading(true);
                    // Ensure numeric ID if possible
                    const numericId = !isNaN(Number(id)) ? Number(id) : id;
                    const response = await ArticleService.getById(numericId.toString());
                    
                    if (!response || !response.data) {
                        throw new Error(`Article with ID ${id} not found`);
                    }
                    
                    const article = response.data.attributes || response.data;
                    // Remember documentId for later use in updates
                    const docId = response.data.attributes?.documentId || response.data.documentId;
                    if (docId) {
                        setDocumentId(docId);
                        console.log("Found documentId:", docId);
                    } else {
                        console.log("No documentId found in response");
                    }
                    
                    setFormData({
                        title: article.title || '',
                        description: article.description || '',
                        slug: article.slug || '',
                        category: article.category?.id ? String(article.category.id) : ''
                    });
                    
                    // If there's a cover image, set the preview URL
                    if (article.cover?.formats?.medium?.url) {
                        setPreviewUrl(`http://localhost:1337${article.cover.formats.medium.url}`);
                    } else if (article.cover?.url) {
                        setPreviewUrl(`http://localhost:1337${article.cover.url}`);
                    }
                    
                    setLoading(false);
                } catch (err: unknown) {
                    console.error("Error fetching article:", err);
                    const errorMessage = axios.isAxiosError(err)
                        ? err.response?.data?.error?.message || err.message
                        : err instanceof Error ? err.message : 'Article not found';
                    setError(errorMessage);
                    setLoading(false);

                    // Redirect back to articles list after 3 seconds
                    setTimeout(() => {
                        navigate('/articles');
                    }, 3000);
                }
            };
            fetchArticle();
        }
    }, [mode, id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setPreviewUrl(fileReader.result as string);
            };
            fileReader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Create a properly formatted slug
            let slug = formData.slug;
            if (!slug) {
                slug = formData.title
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-_.~]/g, '');
            } else {
                slug = slug
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-_.~]/g, '');
            }

            // Handle image upload first if there's a new image
            let coverImageId = null;
            if (coverImage) {
                const imageFormData = new FormData();
                imageFormData.append('files', coverImage);
                
                try {
                    const uploadResponse = await fetch('http://localhost:1337/api/upload', {
                        method: 'POST', 
                        body: imageFormData,
                    });
                    
                    if (!uploadResponse.ok) {
                        throw new Error(`Image upload failed: ${uploadResponse.statusText}`);
                    }
                    
                    const uploadResult = await uploadResponse.json();
                    console.log("Upload result:", uploadResult);
                    coverImageId = uploadResult[0].id;
                } catch (uploadErr) {
                    console.error("Error uploading image:", uploadErr);
                    throw new Error("Failed to upload image. Please try again.");
                }
            }
            
            // Prepare article data for create/update
            const articleData: {
                title: string;
                description: string;
                slug: string;
                cover?: {
                    id: number;
                };
                category?: number | undefined;
            } = {
                title: formData.title,
                description: formData.description,
                slug: slug
            };
            
            // Only include cover if we have a new image to upload
            if (coverImageId) {
                articleData.cover = { id: coverImageId };
            }
            
            // Handle category field - the backend handles the correct format via our custom controller
            if (formData.category && formData.category.trim() !== '') {
                const categoryId = parseInt(formData.category);
                if (!isNaN(categoryId)) {
                    // For both create and update, send the categoryId as a number
                    // Our custom controller will handle the proper format
                    articleData.category = categoryId;
                }
            } else {
                // If a category is empty, don't include it (undefined)
                delete articleData.category;
            }
            
            console.log(`${mode === 'create' ? 'Creating' : 'Updating'} article with data:`, articleData);

            if (mode === 'create') {
                await ArticleService.create(articleData);
                navigate('/articles');
            } else if (mode === 'edit' && id) {
                // Prefer using documentId if available
                if (documentId) {
                    console.log(`Using documentId for update: ${documentId}`);
                    try {
                        const result = await ArticleService.update(documentId, articleData);
                        console.log('Update successful:', result);
                        navigate(`/articles/${id}`);
                    } catch (updateErr: unknown) {
                        console.error('Update error details:', updateErr);
                        throw updateErr;
                    }
                } else {
                    // Fall back to numeric ID if documentId not available
                    let numericId;
                    
                    // First try to convert to number
                    if (!isNaN(Number(id))) {
                        numericId = Number(id);
                        console.log(`Converting ID ${id} to numeric: ${numericId}`);
                    } else {
                        numericId = id;
                        console.log(`Using ID as is: ${id}`);
                    }
                    
                    try {
                        const result = await ArticleService.update(String(numericId), articleData);
                        console.log('Update successful:', result);
                        navigate(`/articles/${numericId}`);
                    } catch (updateErr: unknown) {
                        console.error('Update error details:', updateErr);
                        throw updateErr;
                    }
                }
            }
        } catch (err: unknown) {
            console.error("Error submitting form:", err);
            const errorMessage =
                axios.isAxiosError(err)
                    ? err.response?.data?.error?.message || err.message
                    : err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading && mode === 'edit') {
        return <div className="text-center py-12 px-8 my-8 rounded-xl bg-blue-50 text-blue-900 border-l-4 border-blue-500 shadow-md">Loading article data...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-12 px-8 my-8 rounded-xl bg-red-50 text-red-900 border-l-4 border-red-500 shadow-md">
                <p className="font-bold mb-2">Error</p>
                <p>{error}</p>
                <p className="mt-4">Redirecting to articles page...</p>
                <button
                    onClick={() => navigate('/articles')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                    Return to Articles
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-primary mb-6">
                {mode === 'create' ? 'Create New Article' : 'Edit Article'}
            </h1>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={3}
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">Slug</label>
                    <input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        placeholder="article-url-slug"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        URL-friendly identifier. Only letters, numbers, hyphens, underscores, periods, and tildes allowed.
                        Leave empty to generate from title.
                    </p>
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Cover Image</label>
                    <div className="flex items-center space-x-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            {previewUrl ? 'Change Image' : 'Upload Image'}
                        </button>
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={() => {
                                    setCoverImage(null);
                                    setPreviewUrl(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                                Remove
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>
                    {previewUrl && (
                        <div className="mt-4">
                            <img 
                                src={previewUrl} 
                                alt="Cover preview" 
                                className="max-w-full h-auto max-h-48 rounded border border-gray-300" 
                            />
                        </div>
                    )}
                </div>
                
                <div className="mb-6">
                    <label htmlFor="category" className="block text-gray-700 font-medium mb-2">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">Select a category</option>
                        <option value="1">News</option>
                        <option value="2">Tech</option>
                        <option value="4">Nature</option>
                    </select>
                </div>
                
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:bg-gray-400"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleForm; 