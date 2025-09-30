# 1. Base stage with dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# 2. Builder stage
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# If you're using `.env.production`, copy it
COPY --from=builder /app/.env.production .env.production

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/styles ./styles  

# EXPOSE the right port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
