# syntax=docker/dockerfile:1

# Build Vite React app
FROM node:22-slim AS build
WORKDIR /app

COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci

# Allow overriding API URL at build-time
ARG VITE_API_URL
ARG VITE_API_BASE
ENV VITE_API_URL=${VITE_API_URL}
ENV NEXT_PUBLIC_API_URL=${VITE_API_URL}
ENV VITE_API_BASE=${VITE_API_BASE}

COPY client .
RUN npm run build

# Serve with nginx
FROM nginx:1.27-alpine AS runner

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

