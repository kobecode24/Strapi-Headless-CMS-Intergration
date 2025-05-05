// Environment configuration with type safety
interface Config {
    apiUrl: string;
    environment: 'development' | 'production' | 'test';
    appName: string;
}

// Default configuration
const config: Config = {
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:1337/api',
    environment: (import.meta.env.MODE as 'development' | 'production' | 'test') || 'development',
    appName: 'My Strapi Blog',
};

export default config;