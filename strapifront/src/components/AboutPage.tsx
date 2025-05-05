import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StrapiSingleResponse } from '../types';

interface About {
    title: string;
    content: string;
}

const AboutPage: React.FC = () => {
    const [aboutData, setAboutData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutData = async (): Promise<void> => {
            try {
                const response = await axios.get('http://localhost:1337/api/about');
                setAboutData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching about data:', error);
                setError('Failed to load about information. Please try again later.');
                setLoading(false);
            }
        };

        fetchAboutData();
    }, []);

    if (loading) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-blue-50 text-blue-900 border-l-4 border-blue-500 shadow-md">Loading about information...</div>;
    if (error) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-red-50 text-red-900 border-l-4 border-red-500 shadow-md">{error}</div>;
    if (!aboutData) return <div className="text-center py-12 px-8 my-8 rounded-xl bg-yellow-50 text-yellow-900 border-l-4 border-yellow-500 shadow-md">About information not found</div>;

    // Handle both data structures - either flat or with attributes
    const aboutInfo = aboutData.data?.attributes || aboutData.data || { title: 'About Us', content: 'Information coming soon.' };
    
    // Default values if properties don't exist
    const title = aboutInfo.title || 'About Us';
    const content = aboutInfo.content || 'No about information available yet. Please add content in Strapi.';

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary pb-2 border-b-2 border-gray-100">{title}</h1>
            <div className="bg-white rounded-lg p-8 shadow-md">
                {content.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">{paragraph}</p>
                ))}
            </div>
        </div>
    );
};

export default AboutPage;