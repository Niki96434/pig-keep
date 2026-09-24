import z from "zod";
import {
  NotePutInSchema,
  NotePatchInSchema,
  NoteSchema,
  NoteCreateInSchema,
} from "./validationSchemas";

export type Note = z.output<typeof NoteSchema>;

export type NotesGetOut = {
  notes: Note[];
};

export type NoteCreateIn = z.input<typeof NoteCreateInSchema>;

export type NoteCreateOut = Note;

export type NotePutIn = z.input<typeof NotePutInSchema>;

export type NotePatchIn = z.input<typeof NotePatchInSchema>;

export type NoteUpdateOut = Note;
