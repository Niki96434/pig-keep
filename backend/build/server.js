// src/app.ts
import express3 from "express";

// src/features/notes/controller.ts
function controller({ repo: repo3 }) {
  const {
    getNotesFromDB,
    getNoteByIdFromDB,
    createNoteFromDB,
    putNoteFromDB,
    patchNoteFromDB,
    deleteNoteFromDB,
    clearTrashFromDB,
    restoreNoteFromDB,
    deleteByIdForeverFromDB,
    getNoteTagsFromDB,
    addTagToNoteInDB,
    removeTagFromNoteInDB
  } = repo3;
  const getNotes2 = async (req, res) => {
    const { search, tagId, isArchive, isDeleted } = req.query;
    const notes = await getNotesFromDB({ search, tagId, isArchive, isDeleted });
    return res.status(200).json({ notes });
  };
  const getNoteById2 = async (req, res) => {
    const noteId = req.params.id;
    const note = await getNoteByIdFromDB(noteId);
    if (!note) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ note });
  };
  const createNote2 = async (req, res) => {
    const noteData = req.body;
    const note = await createNoteFromDB(noteData);
    if (!note) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(201).json({ note });
  };
  const putNote2 = async (req, res) => {
    const noteId = req.params.id;
    const noteData = req.body;
    const note = await putNoteFromDB(noteId, noteData);
    if (!note) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ note });
  };
  const patchNote2 = async (req, res) => {
    const noteId = req.params.id;
    const noteData = req.body;
    const note = await patchNoteFromDB(noteId, noteData);
    if (!note) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ note });
  };
  const deleteNote2 = async (req, res) => {
    const noteId = req.params.id;
    const deletedRowCount = await deleteNoteFromDB(noteId);
    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(400).json({ error: "Bad request" });
  };
  const clearTrash2 = async (_req, res) => {
    await clearTrashFromDB();
    return res.status(200).json({ message: "Success" });
  };
  const restoreNote2 = async (req, res) => {
    const noteId = req.params.id;
    const result = await restoreNoteFromDB(noteId);
    if (result === 1) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(404).json({ error: "Not found" });
  };
  const deleteByIdForever2 = async (req, res) => {
    const noteId = req.params.id;
    const deletedCount = await deleteByIdForeverFromDB(noteId);
    if (deletedCount === 1) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(404).json({ error: "Not found" });
  };
  const getNoteTags2 = async (req, res) => {
    const noteId = req.params.id;
    const tags = await getNoteTagsFromDB(noteId);
    return res.status(200).json({ tags });
  };
  const addTagToNote2 = async (req, res) => {
    const { id: noteId, tagId } = req.params;
    await addTagToNoteInDB(noteId, tagId);
    return res.status(200).json({ message: "Success" });
  };
  const removeTagFromNote2 = async (req, res) => {
    const { id: noteId, tagId } = req.params;
    await removeTagFromNoteInDB(noteId, tagId);
    return res.status(200).json({ message: "Success" });
  };
  return {
    getNotes: getNotes2,
    getNoteById: getNoteById2,
    createNote: createNote2,
    putNote: putNote2,
    patchNote: patchNote2,
    deleteNote: deleteNote2,
    clearTrash: clearTrash2,
    restoreNote: restoreNote2,
    deleteByIdForever: deleteByIdForever2,
    getNoteTags: getNoteTags2,
    addTagToNote: addTagToNote2,
    removeTagFromNote: removeTagFromNote2
  };
}

// src/core/db/index.ts
import "dotenv/config";
import * as dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
dotenv.config({ path: "../.env" });
var pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20
});
pool.on("error", (_err) => {
  process.exit(1);
});
var db = drizzle({ client: pool });

// src/core/db/schema.ts
import { boolean, index, pgTable, primaryKey, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { defineRelations, sql } from "drizzle-orm";
var notesTable = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    title: text().default("").notNull(),
    content: text().default("").notNull(),
    isArchive: boolean().default(false).notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }).defaultNow().$onUpdate(() => (/* @__PURE__ */ new Date()).toISOString()).notNull()
  },
  (table) => [
    index("search_index").using(
      "gin",
      sql`to_tsvector('russian', coalesce(${table.title}, '') || ' ' || coalesce(${table.content}))`
    )
  ]
);
var tagsTable = pgTable("tags", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text().notNull().unique()
});
var noteTagsTable = pgTable(
  "note_tags",
  {
    note_id: uuid("note_id").notNull().references(() => notesTable.id, { onDelete: "cascade" }),
    tag_id: uuid("tag_id").notNull().references(() => tagsTable.id, { onDelete: "cascade" })
  },
  (table) => [
    primaryKey({ columns: [table.tag_id, table.note_id] }),
    index("idx_note_tags").on(table.note_id)
  ]
);
var noteTagsRelations = defineRelations({ tagsTable, notesTable, noteTagsTable }, (r) => ({
  tagsTable: {
    notesTable: r.many.notesTable({
      from: r.tagsTable.id.through(r.noteTagsTable.tag_id),
      to: r.notesTable.id.through(r.noteTagsTable.note_id)
    })
  },
  notesTable: {
    tagsTable: r.many.tagsTable({
      from: r.notesTable.id.through(r.noteTagsTable.note_id),
      to: r.tagsTable.id.through(r.noteTagsTable.tag_id)
    })
  }
}));

// src/features/notes/repository.ts
import { and, eq, sql as sql2, desc } from "drizzle-orm";
var noteSelectFields = {
  id: notesTable.id,
  title: notesTable.title,
  content: notesTable.content,
  isArchive: notesTable.isArchive,
  isDeleted: notesTable.isDeleted,
  createdAt: notesTable.createdAt,
  updatedAt: notesTable.updatedAt
};
function repository({ db: db4 }) {
  const getNotesFromDB = async (params) => {
    const { search: rawSearch, tagId, isArchive, isDeleted } = params || {};
    const search = rawSearch?.trim() || void 0;
    const conditions = [];
    if (isArchive !== void 0) {
      conditions.push(eq(notesTable.isArchive, isArchive));
    }
    if (isDeleted !== void 0) {
      conditions.push(eq(notesTable.isDeleted, isDeleted));
    }
    if (search) {
      conditions.push(
        sql2`to_tsvector('russian', coalesce(${notesTable.title}, '') || ' ' || coalesce(${notesTable.content}, '')) @@ websearch_to_tsquery('russian', ${search})`
      );
    }
    if (tagId) {
      conditions.push(eq(noteTagsTable.tag_id, tagId));
      const query = db4.select(noteSelectFields).from(notesTable).innerJoin(noteTagsTable, eq(notesTable.id, noteTagsTable.note_id)).where(conditions.length > 1 ? and(...conditions) : conditions[0]).orderBy(desc(notesTable.updatedAt));
      if (search) {
        return await query.limit(10);
      }
      return await query;
    }
    if (conditions.length > 0) {
      const query = db4.select(noteSelectFields).from(notesTable).where(conditions.length > 1 ? and(...conditions) : conditions[0]).orderBy(desc(notesTable.updatedAt));
      if (search) {
        return await query.limit(10);
      }
      return await query;
    }
    return await db4.select(noteSelectFields).from(notesTable).orderBy(desc(notesTable.updatedAt));
  };
  const getNoteByIdFromDB = async (noteId) => {
    const [note] = await db4.select(noteSelectFields).from(notesTable).where(eq(notesTable.id, noteId));
    return note;
  };
  const createNoteFromDB = async (noteData) => {
    const [note] = await db4.insert(notesTable).values({ ...noteData }).returning();
    return note;
  };
  const putNoteFromDB = async (noteId, noteData) => {
    if (Object.keys(noteData).length === 0) {
      const [note2] = await db4.select(noteSelectFields).from(notesTable).where(eq(notesTable.id, noteId));
      return note2;
    }
    const [note] = await db4.update(notesTable).set({ ...noteData }).where(eq(notesTable.id, noteId)).returning();
    return note;
  };
  const patchNoteFromDB = async (noteId, noteData) => {
    if (Object.keys(noteData).length === 0) {
      const [note2] = await db4.select(noteSelectFields).from(notesTable).where(eq(notesTable.id, noteId));
      return note2;
    }
    const [note] = await db4.update(notesTable).set({ ...noteData }).where(eq(notesTable.id, noteId)).returning();
    return note;
  };
  const deleteNoteFromDB = async (noteId) => {
    const result = await db4.update(notesTable).set({ isDeleted: true }).where(and(eq(notesTable.id, noteId), eq(notesTable.isDeleted, false)));
    return result.rowCount ?? 0;
  };
  const clearTrashFromDB = async () => {
    const result = await db4.delete(notesTable).where(eq(notesTable.isDeleted, true));
    return result.rowCount ?? 0;
  };
  const restoreNoteFromDB = async (id) => {
    const result = await db4.update(notesTable).set({ isDeleted: false }).where(and(eq(notesTable.id, id), eq(notesTable.isDeleted, true)));
    return result.rowCount ?? 0;
  };
  const deleteByIdForeverFromDB = async (id) => {
    const result = await db4.delete(notesTable).where(and(eq(notesTable.id, id), eq(notesTable.isDeleted, true)));
    return result.rowCount ?? 0;
  };
  const getNoteTagsFromDB = async (noteId) => {
    return await db4.select({ id: tagsTable.id, name: tagsTable.name }).from(tagsTable).innerJoin(noteTagsTable, eq(tagsTable.id, noteTagsTable.tag_id)).where(eq(noteTagsTable.note_id, noteId));
  };
  const addTagToNoteInDB = async (noteId, tagId) => {
    const res = await db4.insert(noteTagsTable).values({ note_id: noteId, tag_id: tagId }).onConflictDoNothing().returning();
    return res;
  };
  const removeTagFromNoteInDB = async (noteId, tagId) => {
    const result = await db4.delete(noteTagsTable).where(and(eq(noteTagsTable.note_id, noteId), eq(noteTagsTable.tag_id, tagId)));
    return result.rowCount;
  };
  return {
    getNotesFromDB,
    getNoteByIdFromDB,
    createNoteFromDB,
    putNoteFromDB,
    patchNoteFromDB,
    deleteNoteFromDB,
    clearTrashFromDB,
    restoreNoteFromDB,
    deleteByIdForeverFromDB,
    getNoteTagsFromDB,
    addTagToNoteInDB,
    removeTagFromNoteInDB
  };
}

// src/features/notes/router.ts
import "express";
import express from "express";

// src/core/middlewares/validateSchemas.ts
function validateSchemas(schemas) {
  return async (req, _res, next) => {
    try {
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      if (schemas.query) {
        const parsed = await schemas.query.parseAsync(req.query);
        Object.assign(req.query, parsed);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

// src/features/notes/validationSchemas.ts
import * as z from "zod";
var MAX_NOTE_TITLE_LENGTH = 255;
var MAX_NOTE_CONTENT_LENGTH = 1e3;
var NoteCreateInSchema = z.object({
  title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH).optional(),
  content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH).optional()
}).refine(
  (data) => Boolean(data.title?.trim()) || Boolean(data.content?.trim()),
  {
    message: "At least one field must be specified: title or content"
  }
);
var NotePutInSchema = z.object({
  title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH),
  content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH)
});
var NotePatchInSchema = z.object({
  title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH).optional(),
  content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH).optional(),
  isArchive: z.boolean().optional(),
  isDeleted: z.boolean().optional()
}).refine(
  (data) => data.title !== void 0 || data.content !== void 0 || data.isArchive !== void 0 || data.isDeleted !== void 0,
  {
    message: "At least one field must be specified"
  }
);
var NoteIdSchema = z.object({
  id: z.uuid()
});
var NoteSchema = z.object({
  id: z.uuid(),
  title: z.string().max(MAX_NOTE_TITLE_LENGTH),
  content: z.string().max(MAX_NOTE_CONTENT_LENGTH),
  isArchive: z.boolean().nullable().optional(),
  isDeleted: z.boolean().nullable().optional(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true })
});
var SearchQuerySchema = z.object({
  search: z.string().transform((val) => val.trim() ? val.trim() : void 0).optional(),
  tagId: z.string().uuid().optional(),
  isArchive: z.coerce.boolean().optional(),
  isDeleted: z.coerce.boolean().optional()
}).readonly();

// src/features/notes/router.ts
var notesRouter = express.Router();
var repo = repository({ db });
var {
  getNotes,
  getNoteById,
  createNote,
  putNote,
  patchNote,
  deleteNote,
  clearTrash,
  restoreNote,
  deleteByIdForever,
  getNoteTags,
  addTagToNote,
  removeTagFromNote
} = controller({ repo });
notesRouter.get(
  "/",
  validateSchemas({ query: SearchQuerySchema }),
  (req, res) => getNotes(req, res)
).post("/", validateSchemas({ body: NoteCreateInSchema }), createNote);
notesRouter.delete("/trash", clearTrash).delete("/trash/:id", validateSchemas({ params: NoteIdSchema }), deleteByIdForever).patch("/trash/:id/restore", validateSchemas({ params: NoteIdSchema }), restoreNote);
notesRouter.route("/:id").get(validateSchemas({ params: NoteIdSchema }), getNoteById).put(validateSchemas({ params: NoteIdSchema, body: NotePutInSchema }), putNote).patch(validateSchemas({ params: NoteIdSchema, body: NotePatchInSchema }), patchNote).delete(validateSchemas({ params: NoteIdSchema }), deleteNote);
notesRouter.get("/:id/tags", validateSchemas({ params: NoteIdSchema }), getNoteTags).post("/:id/tags/:tagId", addTagToNote).delete("/:id/tags/:tagId", removeTagFromNote);

// src/features/tags/controller.ts
function controller2({ repo: repo3 }) {
  const {
    getTagsFromDB,
    getTagByIdFromDB,
    createTagFromDB,
    putTagFromDB,
    patchTagFromDB,
    deleteTagFromDB
  } = repo3;
  const getTags2 = async (req, res) => {
    const search = typeof req.query.search === "string" && req.query.search.trim() ? req.query.search.trim() : void 0;
    const tags = await getTagsFromDB(search);
    return res.status(200).json({ tags });
  };
  const getTagById2 = async (req, res) => {
    const tagId = req.params.id;
    const tag = await getTagByIdFromDB(tagId);
    if (!tag) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ tag });
  };
  const createTag2 = async (req, res) => {
    const tagData = req.body;
    const tag = await createTagFromDB(tagData);
    if (!tag) {
      return res.status(400).json({ error: "Bad request" });
    }
    return res.status(201).json({ tag });
  };
  const putTag2 = async (req, res) => {
    const tagId = req.params.id;
    const tagData = req.body;
    const tag = await putTagFromDB(tagId, tagData);
    if (!tag) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ tag });
  };
  const patchTag2 = async (req, res) => {
    const tagId = req.params.id;
    const tagData = req.body;
    const tag = await patchTagFromDB(tagId, tagData);
    if (!tag) {
      return res.status(404).json({ error: "Not found" });
    }
    return res.status(200).json({ tag });
  };
  const deleteTag2 = async (req, res) => {
    const tagId = req.params.id;
    const deletedRowCount = await deleteTagFromDB(tagId);
    if (deletedRowCount && deletedRowCount > 0) {
      return res.status(200).json({ message: "Success" });
    }
    return res.status(400).json({ error: "Bad request" });
  };
  return { getTags: getTags2, getTagById: getTagById2, createTag: createTag2, putTag: putTag2, patchTag: patchTag2, deleteTag: deleteTag2 };
}

// src/features/tags/repository.ts
import { eq as eq2, sql as sql3 } from "drizzle-orm";
function repository2({ db: db4 }) {
  const getTagsFromDB = async (search) => {
    if (search) {
      return await db4.select().from(tagsTable).where(
        sql3`to_tsvector('russian', coalesce(${tagsTable.name}, '')) @@ websearch_to_tsquery('russian', ${search})`
      ).limit(10);
    }
    return await db4.select().from(tagsTable);
  };
  const getTagByIdFromDB = async (tagId) => {
    const [tag] = await db4.select().from(tagsTable).where(eq2(tagsTable.id, tagId));
    return tag;
  };
  const createTagFromDB = async (tagData) => {
    const [tag] = await db4.insert(tagsTable).values({ ...tagData }).returning();
    return tag;
  };
  const putTagFromDB = async (tagId, tagData) => {
    if (Object.keys(tagData).length === 0) {
      const [tag2] = await db4.select().from(tagsTable).where(eq2(tagsTable.id, tagId));
      return tag2;
    }
    const [tag] = await db4.update(tagsTable).set({ ...tagData }).where(eq2(tagsTable.id, tagId)).returning();
    return tag;
  };
  const patchTagFromDB = async (tagId, tagData) => {
    if (Object.keys(tagData).length === 0) {
      const [tag2] = await db4.select().from(tagsTable).where(eq2(tagsTable.id, tagId));
      return tag2;
    }
    const [tag] = await db4.update(tagsTable).set({ ...tagData }).where(eq2(tagsTable.id, tagId)).returning();
    return tag;
  };
  const deleteTagFromDB = async (tagId) => {
    const result = await db4.delete(tagsTable).where(eq2(tagsTable.id, tagId));
    return result.rowCount;
  };
  return {
    getTagsFromDB,
    getTagByIdFromDB,
    createTagFromDB,
    putTagFromDB,
    patchTagFromDB,
    deleteTagFromDB
  };
}

// src/features/tags/router.ts
import "express";
import express2 from "express";

// src/features/tags/validationSchemas.ts
import * as z2 from "zod";
var MAX_TAG_NAME_LENGTH = 255;
var TagIdSchema = z2.object({
  id: z2.uuid()
});
var TagCreateInSchema = z2.object({
  name: z2.string().trim().min(1, "Tag name cannot be empty").max(MAX_TAG_NAME_LENGTH)
});
var TagPutInSchema = TagCreateInSchema;
var TagPatchInSchema = TagCreateInSchema;
var TagSchema = TagIdSchema.merge(TagCreateInSchema);
var TagSearchQuerySchema = z2.object({
  search: z2.string().optional()
}).readonly();

// src/features/tags/router.ts
var tagsRouter = express2.Router();
var repo2 = repository2({ db });
var { getTags, getTagById, createTag, putTag, patchTag, deleteTag } = controller2({ repo: repo2 });
tagsRouter.get("/", (req, res) => getTags(req, res));
tagsRouter.post("/", validateSchemas({ body: TagCreateInSchema }), createTag);
tagsRouter.route("/:id").get(validateSchemas({ params: TagIdSchema }), getTagById).put(validateSchemas({ params: TagIdSchema, body: TagPutInSchema }), putTag).patch(validateSchemas({ params: TagIdSchema, body: TagPatchInSchema }), patchTag).delete(validateSchemas({ params: TagIdSchema }), deleteTag);

// src/core/globalErrorHandler.ts
import * as z3 from "zod";
import { DatabaseError } from "pg";
function globalErrorHandler(err, _req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof z3.ZodError) {
    return res.status(400).json({ error: "Validation error" });
  }
  if (err instanceof DatabaseError) {
    return res.status(500).json({ error: "Database error" });
  }
  res.status(500).json({ error: "Internal server error" });
}

// src/app.ts
import cors from "cors";
var app = express3();
var corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
};
app.use(express3.json());
app.use(cors(corsOptions));
app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/tags", tagsRouter);
app.use(globalErrorHandler);

// src/server.ts
import path from "path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
var DEFAULT_PORT = 3e3;
var port = Number(process.env.PORT) || DEFAULT_PORT;
var server;
var bootstrap = async () => {
  const migrationsFolder = path.resolve(process.cwd(), "migrations");
  await migrate(db, {
    migrationsFolder,
    migrationsTable: "migrations_table",
    migrationsSchema: "migrations_schema"
  });
};
async function start() {
  try {
    await bootstrap();
    server = app.listen(port);
  } catch (err) {
    console.log(`the server terminated with ${err}`);
    process.exit(1);
  }
}
async function shutdown(signal) {
  server.close(async (_err) => {
    console.log(`${signal} received. HTTP server on port ${port} closed`);
    await pool.end();
    console.log("Database pool closed");
    process.exit(0);
  });
  server.closeIdleConnections();
  setTimeout(() => {
    console.log("Shutdown timeout after 10s, forcing exit");
    process.exit(1);
  }, 1e4);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
await start();
