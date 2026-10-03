import * as z from "zod";

export const MAX_NOTE_TITLE_LENGTH = 255;
export const MAX_NOTE_CONTENT_LENGTH = 1_000;

export const NoteCreateInSchema = z
  .object({
    title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH).optional(),
    content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH).optional(),
  })
  .refine(
    (data) => Boolean(data.title?.trim()) || Boolean(data.content?.trim()),
    {
      message: "At least one field must be specified: title or content",
    },
  );

export const NotePutInSchema = z.object({
  title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH),
  content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH),
});

export const NotePatchInSchema = z
  .object({
    title: z.string().trim().max(MAX_NOTE_TITLE_LENGTH).optional(),
    content: z.string().trim().max(MAX_NOTE_CONTENT_LENGTH).optional(),
    isArchive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined ||
      data.isArchive !== undefined ||
      data.isDeleted !== undefined,
    {
      message: "At least one field must be specified",
    },
  );

export const NoteIdSchema = z.object({
  id: z.uuid(),
});

export const NoteSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string().max(MAX_NOTE_TITLE_LENGTH),
  content: z.string().max(MAX_NOTE_CONTENT_LENGTH),
  isArchive: z.boolean().nullable().optional(),
  isDeleted: z.boolean().nullable().optional(),
});

export const SearchQuerySchema = z
  .object({
    search: z
      .string()
      .transform((val) => (val.trim() ? val.trim() : undefined))
      .optional(),
    tagId: z.string().uuid().optional(),
    isArchive: z.coerce.boolean().optional(),
  })
  .readonly();


