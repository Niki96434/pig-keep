import z from "zod";
import {
  NoteUpdateInSchema,
  NoteSchema,
  NoteCreateInSchema,
  NotePatchInSchema,
} from "./validationSchemas";

export type Note = z.output<typeof NoteSchema>;

export type NotesGetOut = {
  notes: Note[];
};

export type NoteCreateIn = z.input<typeof NoteCreateInSchema>;

export type NoteCreateOut = Note;

export type NoteUpdateIn = z.input<typeof NoteUpdateInSchema>;

export type NotePatchIn = z.input<typeof NotePatchInSchema>;

export type NoteUpdateOut = Note;
