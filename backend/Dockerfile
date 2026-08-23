# ==============================================================================
# Dayflow HRMS Backend - Multi-Stage Production Dockerfile
# Base: Node.js 20 on Alpine Linux
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies & Build Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS dependencies
WORKDIR /app

# Install native build tools (needed for native extensions)
RUN apk add --no-cache python3 make g++

# Copy package manifests
COPY package*.json ./

# Install all dependencies (clean install)
RUN npm ci

# Copy application source
COPY . .

# Generate Prisma Client if schema exists
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate; fi

# Prune devDependencies for a lean production footprint
RUN npm prune --omit=dev

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Install curl for container health check probes
RUN apk add --no-cache curl

# Security hardening: Run as non-root user
USER node

# Copy dependencies and production assets with correct ownership
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/package.json ./package.json
COPY --chown=node:node . .

# Expose standard application port
EXPOSE 8080

# Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || curl -f http://localhost:8080/api/health || exit 1

# Start the application server
CMD ["node", "src/server.js"]
