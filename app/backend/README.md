# Документация по серверной части

## Конечные точки

### Тип сущности

```
export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
};
```

### GET /notes

Метод получения всех заметок

Контракт выходных данных:

```
export type NotesGetOut = {
  notes: Note[];
};
```

### GET /notes/:id

Метод получения конкретной заметки по его идентификатору

Контракт выходных данных:

```
export type NoteGetOut = Note;
```

### PATCH /notes/:id

Метод редактирования заметки (частичной замены) по идентификатору

Формат тела запроса:

```
export type NotePutIn = Partial<Pick<Note, "title" | "content">>;
```

Контракт выходных данных:

```
export type NoteUpdateOut = Note;
```

### POST /notes

Метод создания заметки

Формат тела запроса:

```
export type NoteCreateIn = Pick<Note, "user_id" | "title" | "content">;
```

Контракт выходных данных:

```
export type NoteCreateOut = Note;
```

## Миграции

При изменении схем, используется команда, дабы сгенерировать SQL миграционные файлы:

```
npx drizzle-kit generate
```

С помощью cli-команд перед запуском приложения или тестов нужно применить миграции(для боевой и тестовой базы):

```
npx drizzle-kit migrate --config=drizzle.config.ts
npx drizzle-kit migrate --config=drizzle-test.config.ts

```
