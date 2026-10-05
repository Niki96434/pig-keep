FROM node:24.21.0-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY packages/shared/package*.json ./packages/shared/

RUN npm ci

COPY packages/shared ./packages/shared
COPY frontend ./frontend

WORKDIR /usr/src/app/frontend
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine AS runner

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/frontend/dist /usr/share/nginx/html

EXPOSE 8080
USER nginx

CMD ["nginx", "-g", "daemon off;"]
