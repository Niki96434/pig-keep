import z from "zod";
import {
  NoteIdSchema,
  NotePutInSchema,
  NotePatchInSchema,
  NoteSchema,
  NoteCreateInSchema,
} from "./validationSchemas";

export type NoteId = z.input<typeof NoteIdSchema>;

export type Note = z.output<typeof NoteSchema>;

export type NotesGetOut = {
  notes: Note[];
};

export type NoteCreateIn = z.input<typeof NoteCreateInSchema>;

export type NoteCreateOut = Note;

export interface NoteUpdateIn extends NotePutIn {
  id: NoteId;
}

export type NotePutIn = z.input<typeof NotePutInSchema>;

export type NotePatchIn = z.input<typeof NotePatchInSchema>;

export type NoteUpdateOut = Note;
