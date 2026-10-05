# Документация по клиентской части (Frontend)

Клиентская часть приложения Pig Keep построена на **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **TanStack Query (React Query)**, **Zustand**, **React Hook Form** и **Zod**.

---

## 1. Стек технологий

* **Фреймворк и сборка**: React 19, Vite 8, TypeScript 6
* **Стилизация**: Tailwind CSS 4, Lucide React
* **Управление состоянием и кэширование**: TanStack Query (React Query), Zustand
* **Формы и валидация**: React Hook Form, Zod
* **Тестирование**: Vitest, React Testing Library, MSW (Mock Service Worker)
* **Линтинг и форматирование**: ESLint, Prettier

---

## 2. Локальная разработка

Запуск dev-сервера из корня монорепозитория:
```bash
npm run dev:front
```

Или непосредственно из директории `frontend`:
```bash
npm run dev
```

Сборка продакшен-бандла:
```bash
npm run build
```

Запуск тестов:
```bash
npm run test
```

---

## 3. Docker и контейнеризация

Для запуска фронтенда в контейнере используется многоэтапная сборка (multi-stage build), настроенная с учетом структуры монорепозитория.

### 3.1. Структура сборки (Multi-stage Build)

* **Stage 1 (Builder)**:
  * Базовый образ: `node:24.21.0-bookworm-slim` (согласован с версией хоста и бэкенда).
  * **Кэширование слоев (Layer Caching)**: сначала копируются только манифесты зависимостей (`package*.json` корня, фронтенда и пакета `packages/shared`), после чего выполняется `npm ci`. Исходный код копируется отдельным слоем. При изменении компонентов или стилей кэш `node_modules` переиспользуется без повторной установки.
  * Выполняется `npm run build` (проверка типов `tsc -b` и компиляция статики Vite в директорию `dist`).

* **Stage 2 (Production Runner)**:
  * Базовый образ: `nginxinc/nginx-unprivileged:alpine`.
  * В контейнер копируется только папка с готовой статикой (`dist`) из первого этапа.
  * Итоговый вес образа составляет всего **~26.5 МБ** (в отличие от ~1 ГБ при использовании Node.js в рантайме).

### 3.2. Зачем используется Nginx для раздачи фронтенда

1. **Фронтенд — это статика**: после завершения сборки приложение представляет собой набор статичных файлов (`HTML`, `CSS`, `JS`, шрифты, изображения). Среда выполнения Node.js в продакшене не нужна — необходим быстрый и легковесный веб-сервер.
2. **Маршрутизация SPA (Single Page Application)**: при использовании React Router переходы между страницами происходят на клиенте. Если пользователь обновит страницу на маршруте (например, `/notes`) или перейдет по прямой ссылке, веб-сервер без специальной конфигурации вернет ошибку `404 Not Found`. В Nginx настроено правило `try_files $uri $uri/ /index.html;`, перенаправляющее все запросы к несуществующим файлам на `index.html`.
3. **Производительность и безопасность**: веб-сервер берет на себя сжатие контента (Gzip), управление заголовками кэширования для браузера и заголовками безопасности.

### 3.3. Безопасность (Non-root User)

Процесс веб-сервера запускается от имени непривилегированного пользователя:
* Директива: `USER nginx` (UID 101).
* Порт по умолчанию: `8080` (непривилегированные порты > 1024 не требуют прав суперпользователя).
* Соответствует стандартам безопасности Docker/Kubernetes (rootless containers).

### 3.4. Особенности конфигурации Nginx (`nginx.conf`)

* **SPA-маршрутизация**: `try_files $uri $uri/ /index.html;` для всех путей приложения.
* **Gzip-сжатие**: включено сжатие для текстовых и скриптовых типов файлов (`text/plain`, `text/css`, `application/javascript`, `application/json`, `image/svg+xml`).
* **Кэширование статических ассетов**: директория `/assets/` кэшируется браузером на 1 год (`Cache-Control: "public, max-age=31536000, immutable"`), так как имена файлов содержат хэш контента.
* **Запрет кэширования `index.html`**: для `index.html` выставлен заголовок `Cache-Control: "no-store, no-cache, must-revalidate"`, что гарантирует получение клиентами свежей версии приложения сразу после деплоя.
* **Заголовки безопасности**:
  * `X-Frame-Options: SAMEORIGIN` (защита от Clickjacking);
  * `X-Content-Type-Options: nosniff` (защита от MIME-sniffing);
  * `Referrer-Policy: no-referrer-when-downgrade`.
* **Healthcheck**: эндпоинт `/healthz` (возвращает `200 OK`) для мониторинга статуса контейнера.

### 3.5. Оптимизация контекста сборки (`.dockerignore`)

Файлы `.dockerignore` в корне и директории `frontend/` исключают:
* `node_modules/`
* `dist/` и `build/`
* `.git` и служебные файлы IDE
* локальные файлы переменных окружения `.env`

Это предотвращает передачу сотен мегабайт лишних данных демону Docker при сборке.

---

## 4. Сборка и запуск контейнера

### Сборка образа (из корня монорепозитория)
```bash
docker build -f frontend/Dockerfile -t frontend:latest .
```

### Локальный запуск
```bash
docker run -d --name pigkeep-frontend -p 8080:8080 frontend:latest
```

### Проверка работоспособности
```bash
# Проверка отдачи главной страницы
curl -I http://localhost:8080/

# Проверка SPA-роутинга
curl -I http://localhost:8080/notes

# Проверка healthcheck
curl -s http://localhost:8080/healthz
```

### Подключение в `docker-compose.yaml`
```yaml
  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - backend
```
