FROM node:24.21.0-bookworm-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY packages/shared/package*.json ./packages/shared/
RUN npm ci
COPY packages/shared ./packages/shared
COPY backend ./backend
WORKDIR /usr/src/app/backend
RUN npm run build:prod

FROM node:24.21.0-bookworm-slim AS runner
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/backend/build ./backend/build
EXPOSE 3000
USER node
CMD [ "node", "backend/build/server.js"]
