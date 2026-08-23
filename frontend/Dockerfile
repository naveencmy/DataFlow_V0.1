# ==============================================================================
# Dayflow HRMS Frontend - Multi-Stage Production Dockerfile
# Stage 1: Build React/Vite SPA
# Stage 2: Serve via High-Performance Nginx Alpine
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all frontend source files
COPY . .

# Build Arguments for environment configuration at build-time
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compile and optimize production bundle
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Lightweight Nginx Alpine Runtime
# ------------------------------------------------------------------------------
FROM nginx:alpine AS runner

# Remove default Nginx welcome page & configs
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled SPA static artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose container HTTP port
EXPOSE 8080

# Ingress Health Check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
