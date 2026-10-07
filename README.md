# Pig Keep

MVP веб-приложение с виртуальным питомцем, основной продукт которого - приложение заметок. За активность пользователь получает награды в виде XP и HP, повышает уровень питомца и вместе с тем помогает ему повышать шкалу удовольствия.

## Сценарий

1.Регистрация: пользователь регистрируется в приложении, используя почту/логин и пароль.В этот момент за ним закрепляется питомец с базовыми показателями.\
2.Базовый прогресс: активность пользователя за день подсчитывается и пользователь получает XP, отвечающее за уровень удовольствия питомца и HP для поддержания жизни питомца.\
3.Активность: при использовании основного функционала (создание, редактирование, архивация заметок) у питомца растет скрытый параметр - индекс удовольствия.\
4.Если пользователь активно использует приложение, то у него есть возможность попасть в лидерборд, глобальный топ "самых довольных питомцев". Пользователи видят свою позицию в рейтинге, суммарный XP и аватар своего питомца.\
5.Если пользователь совсем не использует приложение заметок(основной продукт),то питомец теряет свои HP, вплоть до того, что питомец может умереть.

## Документация

- Описание решения: [docs/SOLUTION.md](https://github.com/Niki96434/google-keep/blob/main/docs/SOLUTION.md)
- Пользовательский путь: [docs/RULES.md](https://github.com/Niki96434/google-keep/blob/main/docs/RULES.md)
- Тестирование: [docs/TESTING.md](https://github.com/Niki96434/google-keep/blob/main/docs/TESTING.md)
- Руководство по работе с Docker: [docs/DOCKER.md](https://github.com/Niki96434/google-keep/blob/main/docs/DOCKER.md)
- Полнотекстовый поиск с функциями PostgreSQL: [docs/FULLTEXT-SEARCH.md](https://github.com/Niki96434/google-keep/blob/main/docs/FULLTEXT-SEARCH.md)
- Документация по фронтенду: [frontend/README.md](https://github.com/Niki96434/google-keep/blob/main/frontend/README.md)
- Документация по бэкенду: [backend/README.md](https://github.com/Niki96434/google-keep/blob/main/backend/README.md)

## Перечень используемых технологий (с их обоснованием)

- React 19, Typescript, Vite, Eslint, Prettier, Vitest, RTL, MSW, RTQuery, Zod, Zustand
- Express.js, Supertest, Drizzle ORM
- PostgreSQL 18

## Структура проекта

- apps/frontend/src - React-приложение
- apps/backend/core - Инициализация базы данных, глобальный обработчик ошибок, мидлвары
- apps/backend/features - feature-based модульная архитектура
- apps/backend/migrations - миграции PostgreSQL
- apps/packages/shared - общие типы и схемы контракта
- apps/docs - таблица с описанием эндпоинтов(REST), описание решения, диаграммы компонентов и развёртывания, скриншоты дизайна мобильного интерфейса, на планшете и десктоп

## Запуск проекта (Локально)

### 1. Запуск всех сервисов в Docker (рекомендуемый способ)

Стек полностью контейнеризирован (PostgreSQL, Express backend, Nginx frontend). Для запуска убедитесь, что у вас установлен Docker и плагин `docker compose`.

1. Убедитесь в наличии конфигурации переменных окружения:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Запустите все 3 контейнера в фоновом режиме со сборкой:
   ```bash
   docker compose up -d --build
   ```
3. Проверьте статус контейнеров:
   ```bash
   docker compose ps
   ```
4. Просмотр логов:
   ```bash
   docker compose logs -f
   ```
5. Остановка контейнеров:
   ```bash
   docker compose down
   ```

**Доступные сервисы после запуска:**
* **Фронтенд**: [http://localhost:8080](http://localhost:8080)
* **Бэкенд API**: [http://localhost:3000](http://localhost:3000) (проверка: `curl http://localhost:3000/api/v1/notes`)
* **PostgreSQL**: `localhost:5432`

---

### 2. Запуск в режиме разработки (Dev-режим на хосте)

1. Установите зависимости монорепозитория:
   ```bash
   npm ci
   ```
2. Запустите контейнер базы данных:
   ```bash
   docker compose up -d db
   ```
3. Запустите сервисы разработки:
   * **Бэкенд** (порт 3000):
     ```bash
     npm run dev:back
     ```
   * **Фронтенд** (порт 5173):
     ```bash
     npm run dev:front
     ```
4. Запуск тестов:
   ```bash
   npm run test
   ```

## Особенности реализации

1. Backend:

- Codebase-first подход для изменения схем БД(миграции) с помощью drizzle-kit.(Схема как источник истины).
  Создается схема Drizzle для TS, с помощью `drizzle-kit generate` создается migration.sql на основе обновленной схемы. Чтобы применить её к самой БД, используется `drizzle-kit migrate`.

- Multi-staged сборка для Dockerfile. Она изменяет размер конечного образа за счет избавления от зависимостей, нужных для сборки приложения.

- Full-text search(полнотекстовый поиск). Он реализован для более гибкого поиска(не по точному совпадению) с помощью встроенных функций PostgreSQL. В отличие от ILIKE(LIKE), полнотекстовый поиск в PG поддерживает словоформы, упорядочивает список по релевантности и из-за отсутствия индексов(приходится проверять весь список) обычно медленнее.

2. Frontend

- Реализован [api-модуль](https://github.com/Niki96434/google-keep/blob/main/frontend/src/shared/api/notesApi.ts) для инкапсуляции сетевых запросов и изоляции логики работы с сетью от UI.(Separation of Concerns)

## Использование сниппетов

Для ускоренной разработки я использую данные сниппеты для написания шаблонного кода:

- Simple React snippets
- Vitest Snippets

### Главный экран

![Десктоп](https://github.com/Niki96434/google-keep/blob/dev/docs/design-template/pigkeep-dashboard.pdf)\
![Мобильный](https://github.com/Niki96434/google-keep/blob/dev/docs/design-template/pigkeep-mobile.pdf)

