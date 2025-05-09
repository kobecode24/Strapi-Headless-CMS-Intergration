FROM node:18-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with legacy-peer-deps flag
RUN npm ci --legacy-peer-deps

# Copy app source
COPY . .

# Environment variables
ENV VITE_API_URL=http://localhost:1337/api

# Development mode configuration
FROM node:18-alpine as development

WORKDIR /app

COPY --from=build /app/node_modules /app/node_modules
COPY . .

# Expose port for development
EXPOSE 3000

# Start development server with hot reloading
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 