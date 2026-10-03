import z from "zod";
import {
  TagCreateInSchema,
  TagSchema,
  TagPutInSchema,
  TagPatchInSchema,
  TagIdSchema,
  TagSearchQuerySchema,
} from "./validationSchemas";

export type TagId = z.input<typeof TagIdSchema>;

export type Tag = z.output<typeof TagSchema>;

export type TagsGetOut = {
  tags: Tag[];
};

export type TagGetByIdOut = {
  tag: Tag;
};

export type TagCreateIn = z.input<typeof TagCreateInSchema>;

export type TagCreateOut = Tag;

export interface TagUpdateIn extends TagPutIn {
  id: TagId;
}

export type TagPutIn = z.input<typeof TagPutInSchema>;

export type TagPatchIn = z.input<typeof TagPatchInSchema>;

export type TagUpdateOut = Tag;

export type TagSearchQuery = z.input<typeof TagSearchQuerySchema>;
