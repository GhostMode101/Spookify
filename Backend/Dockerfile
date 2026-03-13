# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Copy package files and prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev for prisma generate)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Runtime stage
FROM node:20-alpine
WORKDIR /app

# Install curl for health checks and openssl for Prisma
RUN apk add --no-cache curl openssl

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start server (run Prisma db push then start)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]
