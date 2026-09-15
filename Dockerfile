FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
ENV VITE_API_BASE_URL=""
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
COPY data ./data
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=10000 \
    MEDIA_STORAGE_PATH=/var/data/media \
    MEDIA_WORKER_ENABLED=true
EXPOSE 10000
CMD ["node", "--experimental-sqlite", "server/index.mjs"]
