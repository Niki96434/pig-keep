FROM node:24.21.0-bookworm-slim AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:24.21.0-bookworm-slim AS backend-build
WORKDIR /backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build:prod

FROM node:24.21.0-bookworm-slim AS prod
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=backend-build /backend/build ./build
COPY --from=backend-build /backend/migrations ./migrations
COPY --from=frontend-build /frontend/dist ./frontend/public

USER node
EXPOSE 3000
CMD ["node", "build/server.js"]
