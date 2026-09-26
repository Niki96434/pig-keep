import { useCallback, useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NotePutInSchema } from '@shared/notes/validationSchemas'
import type { NotePutIn } from '@shared/notes/types'
import { useEditNoteMutation } from '../api/useEditNoteMutation'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'
import { useGetNotesQuery } from '@/entity/note/api/useGetNotes'

export function useEditNoteForm() {
  const editMutation = useEditNoteMutation()
  const isOpenForm = useEditNoteStore((state) => state.isOpenEditForm)
  const id = useEditNoteStore((state) => state.noteId)
  const actions = useEditNoteStore((state) => state.actions)

  const { data } = useGetNotesQuery()
  const currentNote = data?.notes.find((note) => note.id === id)

  const { control, handleSubmit, reset } = useForm<NotePutIn>({
    resolver: zodResolver(NotePutInSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  useEffect(() => {
    if (currentNote) {
      reset({
        title: currentNote.title,
        content: currentNote.content,
      })
    }
  }, [currentNote, reset])

  const closeEditForm = useCallback(() => {
    actions.setCloseEditForm()
    actions.removeId()
  }, [actions])

  const onSubmit: SubmitHandler<NotePutIn> = useCallback(
    (formValues) => {
      if (!id) {
        closeEditForm()
        return
      }

      const title = formValues.title.trim()
      const content = formValues.content.trim()

      if (title !== currentNote?.title.trim() || content !== currentNote?.content.trim()) {
        editMutation.mutate({
          id,
          title: formValues.title?.trim() || '',
          content: formValues.content?.trim() || '',
        })
      }
      closeEditForm()
    },
    [id, editMutation, closeEditForm, currentNote]
  )

  const isOpen = Boolean(isOpenForm && id)

  return {
    isOpen,
    control,
    handleSubmit,
    onSubmit,
    id,
  }
}
