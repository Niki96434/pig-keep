# Документация по серверной части

Серверная часть приложения построена на **Express 5**, **Node.js** (TypeScript) и **PostgreSQL 18** с использованием **Drizzle ORM**. Архитектура организована по принципу модульности (Feature-based structure) с четким разделением ответственности (SoC): `Router -> Validation Middleware (Zod) -> Controller -> Repository -> Database`.

---

## 1. Модуль заметок (Feature: Notes)

Базовый путь эндпоинтов: `/api/v1/notes`

### Схема данных (3NF)

1. **`notes`** — основная таблица заметок:
   * `id` (UUID, PK) — уникальный идентификатор заметки (по умолчанию `gen_random_uuid()`);
   * `user_id` (UUID) — идентификатор владельца заметки;
   * `title` (text) — заголовок заметки (макс. 255 символов);
   * `content` (text) — содержимое заметки (макс. 1 000 символов);
   * `isArchive` (boolean, default false) — флаг архивации заметки;
   * `isDeleted` (boolean, default false) — флаг перемещения в корзину.

2. **`noteTags`** — промежуточная таблица (junction table) связи многие-ко-многим:
   * `note_id` (UUID, FK -> `notes.id`, ON DELETE CASCADE) — ссылка на заметку;
   * `tag_id` (UUID, FK -> `tags.id`, ON DELETE CASCADE) — ссылка на тег;
   * Составной первичный ключ: `PRIMARY KEY (tag_id, note_id)`.

### Конечные точки

#### GET /api/v1/notes
Получение списка заметок с возможностью фильтрации.

* **Query-параметры:**
  * `search` (string, optional) — поисковый запрос (фильтрация по совпадению и основам слов в заголовке и содержимом);
  * `tagId` (UUID, optional) — фильтрация заметок по идентификатору привязанного тега;
  * `isArchive` (boolean, optional) — фильтрация по флагу архивации;
  * `isDeleted` (boolean, optional) — фильтрация по флагу корзины.
* **Ответ (200 OK):**
```typescript
{
  notes: Note[];
}
```

#### GET /api/v1/notes/:id
Получение одной заметки по её идентификатору.

* **Параметры пути:** `id` (UUID).
* **Ответ (200 OK):**
```typescript
{
  note: Note;
}
```
* **Ошибки:** `400 Bad Request` (невалидный UUID), `404 Not Found` (заметка не найдена).

#### POST /api/v1/notes
Создание новой заметки. Требуется заполнение хотя бы одного из полей: `title` или `content`.

* **Тело запроса:**
```typescript
{
  title?: string;   // макс. 255 символов
  content?: string; // макс. 1 000 символов
}
```
* **Ответ (201 Created):**
```typescript
{
  note: Note;
}
```
* **Ошибки:** `400 Bad Request` (ошибка валидации схемы).

#### PUT /api/v1/notes/:id
Полное обновление заголовка и содержимого заметки.

* **Параметры пути:** `id` (UUID).
* **Тело запроса:**
```typescript
{
  title: string;   // обязательное, макс. 255 символов
  content: string; // обязательное, макс. 1 000 символов
}
```
* **Ответ (200 OK):**
```typescript
{
  note: Note;
}
```
* **Ошибки:** `400 Bad Request` (ошибка валидации), `404 Not Found`.

#### PATCH /api/v1/notes/:id
Частичное обновление заметки. Необходимо передать хотя бы одно поле.

* **Параметры пути:** `id` (UUID).
* **Тело запроса:**
```typescript
{
  title?: string;
  content?: string;
  isArchive?: boolean;
  isDeleted?: boolean;
}
```
* **Ответ (200 OK):**
```typescript
{
  note: Note;
}
```
* **Ошибки:** `400 Bad Request`, `404 Not Found`.

#### DELETE /api/v1/notes/:id
Удаление заметки по идентификатору.

* **Параметры пути:** `id` (UUID).
* **Ответ (200 OK):**
```typescript
{
  message: "Success";
}
```
* **Ошибки:** `400 Bad Request` (заметка не найдена или не удалена).

#### GET /api/v1/notes/:id/tags
Получение всех тегов, привязанных к конкретной заметке.

* **Параметры пути:** `id` (UUID).
* **Ответ (200 OK):**
```typescript
{
  tags: { id: string; name: string }[];
}
```

#### POST /api/v1/notes/:id/tags/:tagId
Привязка тега к заметке.

* **Параметры пути:** `id` (UUID заметки), `tagId` (UUID тега).
* **Ответ (200 OK):**
```typescript
{
  message: "Success";
}
```

#### DELETE /api/v1/notes/:id/tags/:tagId
Отвязка тега от заметки.

* **Параметры пути:** `id` (UUID заметки), `tagId` (UUID тега).
* **Ответ (200 OK):**
```typescript
{
  message: "Success";
}
```

---

## 2. Модуль тегов (Feature: Tags)

Базовый путь эндпоинтов: `/api/v1/tags`

### Схема данных (3NF)

1. **`tags`** — таблица тегов:
   * `id` (UUID, PK) — уникальный идентификатор тега (по умолчанию `gen_random_uuid()`);
   * `name` (text) — наименование тега (от 1 до 255 символов).

### Конечные точки

#### GET /api/v1/tags
Получение списка всех тегов с возможностью поиска.

* **Query-параметры:**
  * `search` (string, optional) — подстрока для фильтрации по наименованию тега.
* **Ответ (200 OK):**
```typescript
{
  tags: Tag[];
}
```

#### GET /api/v1/tags/:id
Получение тега по его идентификатору.

* **Параметры пути:** `id` (UUID).
* **Ответ (200 OK):**
```typescript
{
  tag: Tag;
}
```
* **Ошибки:** `400 Bad Request` (невалидный UUID), `404 Not Found`.

#### POST /api/v1/tags
Создание нового тега.

* **Тело запроса:**
```typescript
{
  name: string; // от 1 до 255 символов (не пустая строка)
}
```
* **Ответ (201 Created):**
```typescript
{
  tag: Tag;
}
```
* **Ошибки:** `400 Bad Request` (ошибка валидации).

#### PUT /api/v1/tags/:id
Полное обновление наименования тега.

* **Параметры пути:** `id` (UUID).
* **Тело запроса:**
```typescript
{
  name: string; // от 1 до 255 символов
}
```
* **Ответ (200 OK):**
```typescript
{
  tag: Tag;
}
```
* **Ошибки:** `400 Bad Request`, `404 Not Found`.

#### PATCH /api/v1/tags/:id
Частичное обновление наименования тега.

* **Параметры пути:** `id` (UUID).
* **Тело запроса:**
```typescript
{
  name: string; // от 1 до 255 символов
}
```
* **Ответ (200 OK):**
```typescript
{
  tag: Tag;
}
```
* **Ошибки:** `400 Bad Request`, `404 Not Found`.

#### DELETE /api/v1/tags/:id
Удаление тега. При удалении тега все его связи в `noteTags` удаляются каскадно на уровне базы данных.

* **Параметры пути:** `id` (UUID).
* **Ответ (200 OK):**
```typescript
{
  message: "Success";
}
```
* **Ошибки:** `400 Bad Request`.

---

## 3. Модуль виртуальных питомцев (Feature: Virtual Pets)

Архитектура системы опыта (XP) и уровней питомцев построена в соответствии с требованиями третьей нормальной формы (3NF), обеспечивая целостность данных и атомарный фоновый пересчет без проблемы N+1 запросов.

### Схема данных (3NF)

1. **`pets`** — текущее состояние питомца:
   * `id` (UUID, PK) — идентификатор питомца (по умолчанию `gen_random_uuid()`);
   * `name` (varchar(255)) — имя питомца;
   * `level` (integer, default 1) — текущий уровень;
   * `progress` (integer, default 0) — накопленный опыт (XP) в рамках текущего уровня.

2. **`action_types`** — справочник типов действий:
   * `id` (serial, PK) — идентификатор типа действия;
   * `name` (varchar(100), unique) — уникальное наименование действия;
   * `weight` (integer) — ценность действия (количество очков опыта за одно выполнение).

3. **`action_logs`** — журнал событий (append-only):
   * `id` (UUID, PK) — идентификатор записи события;
   * `pet_id` (UUID, FK -> `pets.id`, ON DELETE CASCADE) — ссылка на питомца;
   * `action_type_id` (integer, FK -> `action_types.id`, ON DELETE RESTRICT) — ссылка на тип действия;
   * `created_at` (timestamp with time zone, default now()) — дата и время события.
   * **Индексы:**
     * `idx_action_logs_pet_id` — по полю `pet_id` для быстрой выборки истории питомца;
     * `idx_action_logs_created_at` — по полю `created_at` для фильтрации по временному окну;
     * `idx_action_logs_cron_covering` — составной индекс `(created_at, pet_id, action_type_id)` для Index-Only Scan при агрегации в ночном кроне.

4. **`level_requirements`** — справочник требований опыта:
   * `level` (integer, PK) — уровень питомца;
   * `required_xp` (integer) — количество опыта, необходимое для перехода на следующий уровень.

### Фоновый пересчет прогресса (`processDailyPetProgress`)

* **Пакетная обработка (без N+1):** Пересчет выполняется за один SQL-запрос с использованием `WITH` (CTE) и `UPDATE ... FROM ... LEFT JOIN`.
* **Логика начисления:**
  1. CTE `daily_xp` агрегирует записи из `action_logs` за указанный период (по умолчанию прошедшие сутки), соединяет с `action_types` и суммирует заработанный опыт (`SUM(weight)`) с группировкой по `pet_id`.
  2. Таблица `pets` обновляется путем прибавления заработанного опыта к текущему значению `progress`.
  3. Соединение со справочником `level_requirements` позволяет проверить условие повышения уровня: если `progress + earned_xp >= required_xp`, то `level = level + 1`, а `progress` уменьшается на `required_xp`.
* **Устойчивость к Race Conditions:**
  * **Транзакционный Advisory Lock (`pg_advisory_xact_lock`):** Защищает от наложения повторных запусков cron или одновременного выполнения на нескольких инстансах приложения. Блокировка автоматически освобождается при завершении транзакции.
  * **Строгое временное окно `[startDate, endDate)`:** Исключает пропуск или задвоение событий, поступающих во время выполнения запроса.

---

## 4. Миграции

Генерация SQL-миграций на основе схемы:

```bash
npx drizzle-kit generate
```

Применение миграций к рабочей и тестовой базе данных:

```bash
npx drizzle-kit migrate --config=drizzle.config.ts
npx drizzle-kit migrate --config=drizzle-test.config.ts
```

Быстрая синхронизация схемы с локальной тестовой базой данных (без создания файлов миграций):

```bash
npx drizzle-kit push --config=drizzle-test.config.ts --force
```

---

## 5. Тестирование

Запуск тестов в режиме однократного прогона:

```bash
npm test -- --run
```

Запуск интеграционных тестов с подключением к тестовой базе данных:

```bash
npm run test:api
```
