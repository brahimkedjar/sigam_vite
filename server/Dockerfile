# syntax=docker/dockerfile:1

# Multi-stage build for NestJS + Prisma

FROM node:22-slim AS deps
WORKDIR /app

# Install OS deps
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY server/package*.json server/tsconfig*.json server/nest-cli.json ./server/
COPY server/prisma ./server/prisma

# Install dependencies (include dev for build)
WORKDIR /app/server
RUN npm ci

# Generate Prisma client (dev dependency prisma is available in this stage)
RUN npx prisma generate

# Copy sources and build
COPY server/src ./src
COPY server/public ./public
RUN npm run build

# Prune dev dependencies for production
RUN npm prune --omit=dev


FROM node:22-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install OS deps for Prisma engines
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy production node_modules, dist, prisma, public
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/server/dist ./server/dist
COPY --from=deps /app/server/prisma ./server/prisma
COPY --from=deps /app/server/public ./server/public
COPY server/package*.json ./server/

# Add Prisma CLI in final image to allow running migrations in init containers
WORKDIR /app/server
RUN npm install --no-save prisma@6.10.1

# Expose server port
EXPOSE 3001

# Start with explicit path so CWD remains /app (main.ts expects /app/server/public)
WORKDIR /app
CMD ["node", "server/dist/src/main.js"]

