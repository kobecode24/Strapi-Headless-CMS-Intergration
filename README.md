# Strapi-React Article Management System

A full-stack application for managing articles, built with Strapi (headless CMS) on the backend and React on the frontend. The system provides comprehensive content management with support for articles, categories, media uploads, and rich text content.

## Features

- **Article Management**: Create, read, update, and delete articles
- **Document ID Support**: Articles can be accessed via both numeric IDs and document IDs
- **Media Management**: Upload and manage images, with automatic resizing for thumbnails and various formats
- **Categories**: Organize articles using categories
- **Rich Content**: Support for rich text, quotes, media blocks, and sliders
- **Responsive UI**: Modern, mobile-friendly user interface

## Tech Stack

### Backend
- [Strapi](https://strapi.io/) (v5): Headless CMS
- Node.js
- PostgreSQL/SQLite database
- TypeScript

### Frontend
- React
- React Router
- TypeScript
- Axios for API communication
- Tailwind CSS for styling

## Project Structure

```
G9demo/
├── my-project/              # Strapi backend
│   ├── config/              # Strapi configuration
│   ├── src/
│   │   ├── api/             # API definitions and controllers
│   │   │   ├── article/     # Article API components
│   │   │   ├── category/    # Category API components
│   │   │   └── ...
│   │   ├── extensions/      # Strapi extensions
│   │   └── ...
│   └── ...
│
└── strapifront/            # React frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   ├── hooks/           # Custom React hooks
    │   ├── utils/           # Utility functions
    │   ├── types/           # TypeScript type definitions
    │   └── ...
    └── ...
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (optional, SQLite can be used for development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd my-project
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run develop
   # or
   yarn develop
   ```

4. The Strapi admin panel will be available at http://localhost:1337/admin

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd strapifront
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The React application will be available at http://localhost:5173

## Configuration

### Backend Configuration

Key configuration files are located in the `my-project/config` directory:

- `database.ts`: Database configuration
- `server.ts`: Server settings
- `admin.ts`: Admin panel settings
- `api.ts`: API settings

### Frontend Configuration

The frontend uses environment variables for configuration. Create or modify `.env` file in the `strapifront` directory:

```
VITE_API_URL=http://localhost:1337/api
```

## API Documentation

The application provides a RESTful API for interacting with articles and categories.

### Main Endpoints

#### Articles

- `GET /api/articles`: Get all articles
- `GET /api/articles/:id`: Get article by numeric ID
- `GET /api/articles/:id/related`: Get articles related to a specific article
- `POST /api/articles`: Create a new article
- `PUT /api/articles/:id`: Update an article by numeric ID
- `PUT /api/articles/document/:documentId`: Update an article by document ID
- `DELETE /api/articles/:id`: Delete an article

#### Categories

- `GET /api/categories`: Get all categories
- `GET /api/categories/:id`: Get category by ID
- `POST /api/categories`: Create a new category
- `PUT /api/categories/:id`: Update a category
- `DELETE /api/categories/:id`: Delete a category

#### Media

- `POST /api/upload`: Upload media files

## Custom Backend Logic

The application implements custom controller logic to handle:

1. Relationship management (especially for categories)
2. Document ID-based operations
3. Error handling and debugging
4. Media processing

## Frontend Components

- `ArticleList`: Displays a list of articles with options to edit and delete
- `ArticleDetail`: Shows detailed view of a single article
- `ArticleForm`: Form for creating and editing articles
- `HomePage`: Landing page with featured articles
- `ContentBlocks`: Component for rendering different content block types

## TypeScript Integration

Both frontend and backend use TypeScript for type safety:

- Interface definitions for articles, categories, and API responses
- Type-safe API services
- Proper error handling with typed error responses

## Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Ensure Strapi is running at http://localhost:1337
   - Check CORS settings in Strapi if needed

2. **Image Upload Failures**:
   - Verify upload permissions in Strapi
   - Check file size limits

3. **Category Relationship Issues**:
   - Make sure category IDs are correct
   - For updates, use the proper format (numeric ID)

## Testing the API

For comprehensive API testing, use the provided Postman collection in the project. Import the collection into Postman to access pre-configured requests for all endpoints with sample data. 