// src/components/ArticleDetail.tsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useArticle } from '../hooks/useArticles';
import ContentBlocks from './ContentBlocks';
import { ArticleService } from '../services/api';

interface RouteParams {
    id: string;
    [key: string]: string;
}

const ArticleDetail: React.FC = () => {
    const { id } = useParams<RouteParams>() as RouteParams;
    const { article, loading, error } = useArticle(id);
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    // Redirect to articles page after a timeout if there's an error
    React.useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                navigate('/articles');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                // Get documentId from either nested or flat structure
                if (article) {
                    const   documentId = article.data.attributes?.documentId || article.data.documentId;
                    if (documentId) {
                        await ArticleService.delete(documentId);
                        navigate('/articles');
                    } else {
                        // Fallback to using ID if documentId is not available
                        await ArticleService.delete(id);
                        navigate('/articles');
                    }
                } else {
                    throw new Error('Article data not available');
                }
            } catch (err) {
                console.error('Error deleting article:', err);
                setIsDeleting(false);
                alert('Failed to delete article. Please try again.');
            }
        }
    };

    if (loading) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-blue-50 text-blue-900 border-l-4 border-blue-500 shadow-md">Loading article...</div>;
    if (error) return (
        <div className="text-center py-12 px-8 my-8 rounded-xl bg-red-50 text-red-900 border-l-4 border-red-500 shadow-md">
            <p className="font-bold mb-2">Error loading article</p>
            <p>{error}</p>
            <p className="mt-4">Redirecting to articles page...</p>
        </div>
    );
    if (!article || !article.data) return (
        <div className="text-center py-12 px-8 my-8 rounded-xl bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 shadow-md">
            <p className="font-bold mb-2">The requested content could not be found.</p>
            <p>Please check if the article exists or return to the articles page.</p>
            <Link to="/articles" className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">
                Back to Articles
            </Link>
        </div>
    );

    // Handle both possible data structures
    const articleData = article.data.attributes || article.data;

    const { title, description, createdAt, cover, blocks, author, category } = articleData;

    // Format date
    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-lg p-8 shadow-md">
            <Link to="/articles" className="inline-block mb-6 text-primary font-medium transition-transform hover:-translate-x-1">
                &larr; Back to Articles
            </Link>

            <div className="flex gap-3 mb-6">
                <Link to={`/articles/edit/${id}`} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Edit
                </Link>
                <button 
                    onClick={handleDelete} 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>

            {/* Cover image */}
            {cover && (
                <div className="mb-6 -mx-8 -mt-8 rounded-t-lg overflow-hidden">
                    <img
                        src={`http://localhost:1337${cover.formats.large?.url || cover.formats.medium.url}`}
                        alt={cover.alternativeText || title}
                        className="w-full h-auto"
                    />
                </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{title}</h1>

            {description && (
                <p className="text-lg text-gray-600 mb-6">{description}</p>
            )}

            <div className="flex flex-wrap mb-8 text-sm text-gray-600 border-b pb-4">
                {author && <span className="mr-6">By: {author.name}</span>}
                {category && <span className="mr-6">Category: {category.name}</span>}
                <span>Published: {formattedDate}</span>
            </div>

            {/* Render content blocks */}
            {blocks && <ContentBlocks blocks={blocks} />}
        </div>
    );
};

export default ArticleDetail;