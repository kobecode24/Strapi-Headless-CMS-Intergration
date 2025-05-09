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

- `my-project/` - Strapi backend
- `strapifront/` - React frontend
- `docker-compose.yml` - Docker Compose configuration

## Getting Started with Docker

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Project

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start the application stack:
   ```bash
   docker-compose up -d
   ```

3. Access the applications:
   - Strapi Admin: http://localhost:1337/admin
   - React Frontend: http://localhost:3000

### Development Workflow

The Docker setup is configured for development with hot-reloading:

- Changes to Strapi backend files in `my-project/src` will automatically reload the backend
- Changes to React frontend files in `strapifront/src` will automatically reload the frontend

### Stopping the Project

```bash
docker-compose down
```

To remove the volumes (database data) as well:
```bash
docker-compose down -v
```

## First-time Setup

When running the Strapi backend for the first time:

1. Access http://localhost:1337/admin
2. Create an admin user
3. Create content types and add content

## Environment Variables

### Strapi Backend

Environment variables for the Strapi backend are configured in the `docker-compose.yml` file.

### React Frontend

The frontend connects to the Strapi API using the `VITE_API_URL` environment variable.

## Services

- **postgres**: PostgreSQL database
- **strapi**: Strapi backend
- **frontend**: React frontend

## Data Persistence

Database data is persisted in a Docker volume named `postgres-data`.

## Production Deployment

For production deployment, modify the Dockerfiles and docker-compose.yml:

1. In the Strapi Dockerfile, change `CMD ["npm", "run", "develop"]` to `CMD ["npm", "start"]`
2. In the React frontend Dockerfile, add a production build stage with Nginx

## Troubleshooting

- **Database Connection Issues**: Make sure the database container is running and healthy
- **API Connection Issues**: Check that the `VITE_API_URL` environment variable is set correctly
- **Container Logs**: Run `docker-compose logs -f [service-name]` to view container logs

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