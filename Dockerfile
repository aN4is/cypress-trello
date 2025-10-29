# syntax=docker/dockerfile:1.4

# === Base Configuration ===
# Pin specific Node version for reproducibility across environments
# LTS version ensures long-term support and stability
ARG NODE_VERSION=20.18.0
ARG DEBIAN_VERSION=bookworm
FROM node:${NODE_VERSION}-${DEBIAN_VERSION}-slim AS base

LABEL org.opencontainers.image.title="Cypress Trello App"

# Install git as system dependency for npm packages that need it
# Using --no-install-recommends keeps image smaller
# Clean apt cache immediately to reduce layer size
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends git
rm -rf /var/lib/apt/lists/*
EOF

# === Development Stage ===
FROM base AS development

WORKDIR /app

# Change ownership of workdir to node user before switching
# This ensures node user can write to /app and create node_modules
RUN chown -R node:node /app

# Switch to node user early (exists in official Node images)
# Running as non-root prevents accidental system modifications
# Files created by npm will have correct ownership
USER node

# Copy dependency files first to leverage Docker layer caching
# Package manifests change less frequently than source code
COPY --chown=node:node package*.json ./

# Install root dependencies with cache mount for faster rebuilds
# Cache mount persists npm cache between builds
# sharing=locked allows concurrent builds to safely share cache
# uid/gid ensure cache is owned by node user
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000,sharing=locked \
    npm ci

# Copy source code after dependencies are installed
# This maximizes cache hits during iterative development
COPY --chown=node:node . .

# Install trelloapp dependencies in its subdirectory
# Monorepo structure requires installing deps in multiple locations
WORKDIR /app/trelloapp
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000,sharing=locked \
    npm ci

# Return to root workspace for command execution
WORKDIR /app

# Parameterize port to allow override at build time
# Makes image flexible for different deployment scenarios
ARG APP_PORT=3000
EXPOSE ${APP_PORT}

# Health check allows Docker/Kubernetes to detect when app is ready
# Uses Node's built-in http module to avoid external dependencies
# Start period gives app time to initialize before health checks begin
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${APP_PORT}', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use exec form (JSON array) for proper signal handling
# Allows npm to receive SIGTERM for graceful shutdown
CMD ["npm", "run", "docker:start"]