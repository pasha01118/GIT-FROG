# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source code
COPY . .

# Build Vite frontend & Esbuild Express server
RUN npm run build

# ==========================================
# STAGE 2: Production Execution Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV VITE_DEPLOY_MODE=docker

# Copy built artifacts and package manifest
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Expose port 3000
EXPOSE 3000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start bundled CJS server
CMD ["node", "dist/server.cjs"]
