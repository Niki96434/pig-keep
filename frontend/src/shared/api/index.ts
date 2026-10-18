import type { components, paths } from './generated/schema'

export { apiClient } from './client'
export { queryClient } from './queryClient'
export type { components, paths }

export type Note = components['schemas']['Note']
export type NoteCreateIn = components['schemas']['NoteCreateIn']
export type NotePutIn = components['schemas']['NotePutIn']
export type NotePatchIn = components['schemas']['NotePatchIn']

export type Tag = components['schemas']['Tag']
export type TagCreateIn = components['schemas']['TagCreateIn']
export type TagPutIn = components['schemas']['TagPutIn']
export type TagPatchIn = components['schemas']['TagPatchIn']

export type NotesGetOut = {
  notes: Note[]
}

export type TagsGetOut = {
  tags: Tag[]
}
