import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { ArticleService } from '../services/api';

// Helper function to get image URL
const getImageUrl = (cover: any) => {
  if (!cover) return 'https://placehold.co/600x400?text=No+Image';
  
  const baseUrl = 'http://localhost:1337';
  if (cover.formats?.medium?.url) return `${baseUrl}${cover.formats.medium.url}`;
  if (cover.formats?.small?.url) return `${baseUrl}${cover.formats.small.url}`;
  if (cover.url) return `${baseUrl}${cover.url}`;
  
  return 'https://placehold.co/600x400?text=No+Image';
};

const ArticleList: React.FC = () => {
    const { articles, loading, error, refetch } = useArticles();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
            try {
                setDeletingId(id);
                await ArticleService.delete(id.toString());
                // Refresh the list after delete
                refetch();
            } catch (err) {
                console.error('Error deleting article:', err);
                alert('Failed to delete article. Please try again.');
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-blue-50 text-blue-900 border-l-4 border-blue-500 shadow-md">Loading articles...</div>;
    if (error) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-red-50 text-red-900 border-l-4 border-red-500 shadow-md">{error}</div>;
    if (!articles) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 shadow-md">No articles data available</div>;

    console.log("Articles data:", articles);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-primary pb-2 border-b-2 border-gray-100">All Articles</h2>
                <Link 
                    to="/articles/create" 
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                    Create Article
                </Link>
            </div>
            {!articles.data || articles.data.length === 0 ? (
                <p className="text-gray-600">No articles found. Please add some content in Strapi.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {articles.data.map((article) => {
                        // Handle both possible data structures
                        const articleData = article.attributes || article;
                        
                        return (
                            <div key={article.id} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg hover:-translate-y-1 transition-all">
                                {articleData.cover && (
                                    <div>
                                        <img
                                            src={getImageUrl(articleData.cover)}
                                            alt={articleData.cover.alternativeText || articleData.title || 'Article image'}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Error';
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-primary mb-2">{articleData.title || 'Untitled'}</h3>

                                    {articleData.description && (
                                        <p className="text-gray-600 mb-4">{articleData.description}</p>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Link to={`/articles/${article.id}`} className="text-primary font-medium hover:underline">
                                                Read More
                                            </Link>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link 
                                                to={`/articles/edit/${article.id}`} 
                                                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                disabled={deletingId === article.id}
                                                className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-red-300"
                                            >
                                                {deletingId === article.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                            {articleData.category && (
                                                <span className="inline-block bg-gray-100 px-3 py-1 rounded-md text-sm">
                                                    {articleData.category.name || 'Uncategorized'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ArticleList;