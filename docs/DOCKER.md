# Руководство по работе с Docker

Проект Pig Keep полностью контейнеризирован с помощью **Docker** и **Docker Compose**. Стек состоит из 3 независимых сервисов, разворачиваемых в изолированной сети.

---

## Архитектура контейнеров

```
               [ Пользователь / Браузер ]
                 /                   \
        :8080   /                     \   :3000
               v                       v
     +-------------------+    +-------------------+
     | frontend (Nginx)  |    |  backend (Node)   |
     |   SPA Статика     |    |   REST API        |
     +-------------------+    +---------+---------+
                                        | :5432
                                        v
                              +-------------------+
                              |    db (Postgres)  |
                              |   База данных     |
                              +-------------------+
```

1. **`db`** (`postgres:18.4`):
   * СУБД PostgreSQL 18.
   * Пароль монтируется через Docker Secrets (`/run/secrets/pg-password`).
   * Данные сохраняются в именованном томе `db-data`.
   * Настроен встроенный `healthcheck` (`pg_isready`).

2. **`backend`** (`node:24.21.0-bookworm-slim`):
   * Двухэтапная сборка (builder + production runner).
   * Автоматическое применение миграций Drizzle ORM при старте.
   * Стартует только после подтверждения здоровья БД (`condition: service_healthy`).
   * Запуск от непривилегированного пользователя `node`.

3. **`frontend`** (`nginxinc/nginx-unprivileged:alpine`):
   * Двухэтапная сборка (Node.js builder -> Nginx runner).
   * Раздача скомпилированного бандла Vite.
   * Настроен SPA-роутинг (`try_files $uri $uri/ /index.html;`), gzip-сжатие, заголовки кэширования и безопасности.
   * Запуск от непривилегированного пользователя `nginx` (UID 101) на порту `8080`.
   * Вес итогового образа: **~26.5 МБ**.

---

## Команды управления

### Запуск всех сервисов (сборка и старт в фоне)
```bash
docker compose up -d --build
```

### Просмотр статуса сервисов
```bash
docker compose ps
```

### Просмотр логов
```bash
# Все сервисы
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

### Остановка и удаление контейнеров
```bash
docker compose down
```

### Остановка с удалением тома базы данных
```bash
docker compose down -v
```

---

## Сборка отдельных образов

Сборка образов вручную из корня репозитория:

```bash
# Фронтенд
docker build -f frontend/Dockerfile -t frontend:latest .

# Бэкенд
docker build -f backend/Dockerfile -t backend:latest .
```
