import * as z from "zod";

export const NoteCreateInSchema = z
  .object({
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(1_000).optional(),
  })
  .refine(
    (data) => Boolean(data.title?.trim()) || Boolean(data.content?.trim()),
    {
      message: "At least one field must be specified: title or content",
    },
  );

export const NotePutInSchema = z.object({
  title: z.string().trim().max(255).optional(),
  content: z.string().trim().max(1_000).optional(),
});

export const NotePatchInSchema = z
  .object({
    title: z.string().trim().max(255).optional(),
    content: z.string().trim().max(1_000).optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field must be specified: title or content",
  });

export const NoteIdSchema = z.object({
  id: z.uuid(),
});

export const NoteSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  title: z.string().max(255),
  content: z.string().max(1_000),
});
