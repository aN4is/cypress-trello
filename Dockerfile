# Use official Node.js LTS image
FROM node:20-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    && rm -rf /var/lib/apt/lists/*

# Development stage
FROM base AS development

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies (including devDependencies for Cypress)
RUN npm ci

# Copy trelloapp package files
COPY trelloapp/package*.json ./trelloapp/

# Install trelloapp dependencies
WORKDIR /app/trelloapp
RUN npm ci

# Copy source code
WORKDIR /app
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Health check for container readiness
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Trello application
CMD ["npm", "start"]