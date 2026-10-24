# 🐷 Pig Keep

Pig Keep - local-hosted веб-приложение для ведения заметок.

## Основной функционал MVP:
  Создание, редактирование, архивация и удаление заметок с
  их организацией с помощью тегов.\
  Помимо этого в приложение встроен быстрый полнотекстовый поиск на базе PostgreSQL с поддержкой русской локализации по содержимому.

## Документация

- Особенности реализации: [docs/SPECS.md](https://github.com/Niki96434/google-keep/blob/main/docs/DETAILS.md)
- Документация по бэкенду: [backend/README.md](https://github.com/Niki96434/google-keep/blob/main/backend/README.md)
- Тестирование: [docs/TESTING.md](https://github.com/Niki96434/google-keep/blob/main/docs/TESTING.md)

## Перечень используемых технологий

- React 19, Typescript, Vite, Eslint, Prettier, Vitest, RTL, MSW, RTQuery, Zod, Zustand
- Express.js, Supertest, Drizzle ORM
- PostgreSQL 18

## Структура проекта

- frontend/src - React-приложение
- backend/core - Инициализация базы данных, глобальный обработчик ошибок, мидлвары
- backend/features - feature-based модульная архитектура
- backend/migrations - миграции PostgreSQL
- docs - особенности решения, тестирование, скриншоты дизайна мобильного и десктоп интерфейсов

## Запуск проекта (local-hosted)

Для запуска убедитесь, что у вас установлен Docker и плагин `docker compose`.

1. Убедитесь в наличии конфигурации переменных окружения:
   ```bash
   cp .env.example .env
   ```
2. Запустите контейнер с базой данных в фоновом режиме:
   ```bash
   docker compose up -d
   ```
3. Проверьте статус контейнера:
   ```bash
   docker compose ps
   ```
4. Просмотр логов:
   ```bash
   docker compose logs -f
   ```
5. Остановка контейнера:
   ```bash
   docker compose down
   ```
Сервис будет доступен на `http://localhost:5173`

## Использование сниппетов

Для ускоренной разработки я использую данные сниппеты для написания шаблонного кода:

- Simple React snippets
- Vitest Snippets

### Дизайн

![Десктоп](https://github.com/Niki96434/google-keep/blob/main/docs/design-template/pigkeep-dashboard.pdf)\
![Мобильный](https://github.com/Niki96434/google-keep/blob/main/docs/design-template/pigkeep-mobile.pdf)

### Скриншоты

#### Главный экран (свернутое меню)
![Главный экран (свернутое меню)](docs/screenshots/home.png)

#### Создание и редактирование заметки
![Создание и редактирование заметки](docs/screenshots/form.png)

#### Создание и редактирование тегов
![Создание и редактирование тегов](docs/screenshots/crud-tag.png)

#### Мобильный интерфейс
![Мобильный интерфейс](docs/screenshots/mobile.png)

