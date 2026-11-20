# Анализ безопасности и уязвимостей (Security Audit)

В данном документе зафиксированы результаты аудита безопасности кодовой базы проекта Pig Keep (ветка `fix/add-security`).

---

## 1. Список выявленных уязвимостей и точек внимания

### 1.1. Broken Object Level Authorization (BOLA / IDOR) & Missing Authentication
- **Категория:** OWASP Top 10 — Broken Access Control
- **Файлы для анализа:**
  - `backend/src/core/db/schema.ts`
  - `backend/src/features/notes/router.ts`
  - `backend/src/features/tags/router.ts`
- **Суть проблемы:** В приложении отсутствуют механизмы аутентификации (сессии, JWT, токены) и авторизации. В схеме базы данных отсутствует привязка записей к пользователю (`user_id`), в результате чего любой клиент имеет полный доступ (чтение, модификация, удаление, очистка корзины) ко всем заметкам и тегам.

### 1.2. Missing HTTP Security Headers (Отсутствие базовых заголовков безопасности)
- **Категория:** OWASP Top 10 — Security Misconfiguration
- **Файл для анализа:**
  - `backend/src/app.ts`
- **Суть проблемы:** Сервер не устанавливает защитные HTTP-заголовки (например, `Content-Security-Policy`, `X-Frame-Options` для защиты от Clickjacking, `X-Content-Type-Options` для защиты от MIME-sniffing, `Strict-Transport-Security` и др.).

### 1.3. Resource Exhaustion / Unbounded Queries (DoS через нелимитированные выборки)
- **Категория:** CWE-400 / CWE-770 (Uncontrolled Resource Consumption)
- **Файлы для анализа:**
  - `backend/src/features/notes/repository.ts`
  - `backend/src/features/tags/repository.ts`
- **Суть проблемы:** Запросы получения заметок (`GET /api/v1/notes` без поискового запроса) и тегов (`GET /api/v1/tags`) не содержат пагинации (нет лимитов `limit` / `offset` или курсоров). При накоплении большого объема данных в БД это может привести к чрезмерному потреблению памяти Node.js и падению сервиса.

### 1.4. Lack of Rate Limiting (Отсутствие ограничения частоты запросов)
- **Категория:** Denial of Service / Brute Force
- **Файл для анализа:**
  - `backend/src/app.ts`
- **Суть проблемы:** Отсутствуют лимиты на количество входящих запросов с одного IP-адреса. Любой клиент может беспрепятственно спамить созданием ресурсов или вызывать деструктивные эндпоинты (например, полную очистку корзины `/api/v1/notes/trash`).

### 1.5. Improper Input Validation (Пропуск валидации параметров маршрута и query)
- **Категория:** OWASP Top 10 — Injection / Insecure Design
- **Файлы для анализа:**
  - `backend/src/features/notes/router.ts` (эндпоинты связывания тегов с заметками)
  - `backend/src/features/tags/router.ts` (эндпоинт получения тегов)
- **Суть проблемы:**
  - В маршрутах привязки и отвязки тегов к заметкам параметр `:tagId` не проходит валидацию схемы Zod.
  - В маршруте `GET /api/v1/tags` объявленная схема `TagSearchQuerySchema` не подключена в middleware, запрос выполняется без валидации входных параметров.

### 1.6. Information Exposure / Fingerprinting (Раскрытие сведений о стеке)
- **Категория:** Information Disclosure
- **Файл для анализа:**
  - `backend/src/app.ts`
- **Суть проблемы:** По умолчанию Express отправляет заголовок `X-Powered-By: Express`, раскрывая детали технологического стека потенциальному злоумышленнику.

### 1.7. Insecure Infrastructure Defaults (Дефолтные учётные данные и открытые порты)
- **Категория:** Security Misconfiguration
- **Файл для анализа:**
  - `docker-compose.yaml`
- **Суть проблемы:** Для тестовой базы данных в манифесте зашиты значения логина и пароля по умолчанию (`nika` / `nikakika2004`). Кроме того, порты PostgreSQL (`5432`, `5433`) проброшены на хост-систему наружу без ограничения на `127.0.0.1`.
