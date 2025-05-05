import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedArticles } from '../hooks/useArticles';
import { Article, StrapiData } from '../types';

const HomePage: React.FC = () => {
    const { articles, loading, error } = useFeaturedArticles();

    if (loading) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-blue-50 text-blue-900 border-l-4 border-blue-500 shadow-md">Loading featured articles...</div>;
    if (error) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-red-50 text-red-900 border-l-4 border-red-500 shadow-md">{error}</div>;
    if (!articles) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 shadow-md">No article data available</div>;

    return (
        <div className="w-full">
            <div className="text-center py-20 px-8 mb-12 rounded-lg bg-primary text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to My Strapi Blog</h1>
                <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">Explore the latest articles and insights</p>
                <Link to="/articles" className="inline-block bg-white text-primary px-8 py-3 rounded-full font-semibold transition-all hover:bg-white/90 hover:-translate-y-1 hover:shadow-lg active:translate-y-0 active:shadow-md">
                    Browse All Articles
                </Link>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-8 text-primary pb-2 border-b-2 border-gray-100">Featured Articles</h2>
                {articles.data.length === 0 ? (
                    <p className="text-gray-600">No articles found. Please add some content in Strapi.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                        {articles.data.map((article: StrapiData<Article>) => (
                            <div key={article.id} className="bg-white rounded-lg p-6 shadow hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                <h3 className="text-xl font-bold text-primary mb-3">{article.attributes?.title}</h3>
                                <p className="text-gray-600 mb-4 flex-grow">
                                    {article.attributes?.content
                                        ? article.attributes.content.substring(0, 100) + '...'
                                        : article.attributes?.description
                                            ? article.attributes.description.substring(0, 100) + '...'
                                            : 'Read this article for more information'
                                    }
                                </p>
                                <Link to={`/articles/${article.id}`} className="text-primary font-medium hover:underline">
                                    Read More
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;