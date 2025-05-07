// src/components/ContentBlocks.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ContentBlock } from '../types';

interface ContentBlocksProps {
    blocks: ContentBlock[];
}

// Component for rendering a single block based on its type
const Block: React.FC<{ block: ContentBlock }> = ({ block }) => {
    switch (block.__component) {
        case 'shared.rich-text':
            return (
                <div className="prose max-w-none mb-8">
                    <ReactMarkdown>{block.body}</ReactMarkdown>
                </div>
            );

        case 'shared.quote':
            return (
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-8 bg-gray-50 rounded">
                    <p className="text-lg italic mb-2">{block.body}</p>
                    {block.title && <footer className="text-sm font-medium">— {block.title}</footer>}
                </blockquote>
            );

        case 'shared.media':
            return (
                <div className="my-8">
                    {/* Implement media rendering based on your media structure */}
                    <p className="text-gray-500 text-sm">Media content</p>
                </div>
            );

        case 'shared.slider':
            return (
                <div className="my-8">
                    {/* Implement slider component */}
                    <p className="text-gray-500 text-sm">Image slider</p>
                </div>
            );

        default:
            return <div>Unknown block type: {block.__component}</div>;
    }
};

// Main component to render a list of blocks
const ContentBlocks: React.FC<ContentBlocksProps> = ({ blocks }) => {
    return (
        <div className="content-blocks">
            {blocks.map((block) => (
                <Block key={block.id} block={block} />
            ))}
        </div>
    );
};

export default ContentBlocks;