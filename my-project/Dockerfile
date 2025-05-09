FROM node:18-alpine

# Install dependencies for node-gyp 
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Environment variables
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

# Build the app (for production)
RUN npm run build

# Expose port
EXPOSE 1337

# Set the command to start the app in development mode (for hot reloading)
# Change to "npm start" for production
CMD ["npm", "run", "develop"] 