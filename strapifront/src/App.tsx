import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArticleList from './components/ArticleList';
import ArticleDetail from './components/ArticleDetail';
import AboutPage from './components/AboutPage';
import ArticleForm from './components/ArticleForm';

const App: React.FC = () => {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <header className="bg-primary text-white p-4">
                    <div className="max-w-6xl mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">My Strapi Blog</h1>
                        <nav>
                            <ul className="flex gap-6 list-none m-0 p-0">
                                <li><Link to="/" className="text-white hover:underline">Home</Link></li>
                                <li><Link to="/articles" className="text-white hover:underline">Articles</Link></li>
                                <li><Link to="/about" className="text-white hover:underline">About</Link></li>
                            </ul>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/articles" element={<ArticleList />} />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/articles/create" element={<ArticleForm mode="create" />} />
                        <Route path="/articles/edit/:id" element={<ArticleForm mode="edit" />} />
                    </Routes>
                </main>

                <footer className="bg-gray-100 py-6 text-center mt-auto">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-gray-600">© 2025 My Strapi Blog - Built with React & Strapi</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;