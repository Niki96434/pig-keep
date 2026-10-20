FROM node:24.21.0-bookworm-slim AS builder
WORKDIR /app
COPY package*.json /app
RUN npm ci
COPY . .
RUN npm run build:prod

FROM node:24.21.0-bookworm-slim AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build
COPY --from=builder /app/migrations ./migrations
USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
