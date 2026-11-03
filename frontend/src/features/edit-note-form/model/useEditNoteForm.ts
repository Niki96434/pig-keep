import { useEffect, useRef } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NotePutInSchema } from './schema'
import type { NotePutIn } from '@/shared/api'
import { useEditNoteMutation } from '../api/useEditNoteMutation'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'
import { useGetNotesQuery } from '@/entities/note'

export function useEditNoteForm() {
  const editMutation = useEditNoteMutation()

  const isOpenForm = useEditNoteStore((state) => state.isOpenEditForm)
  const id = useEditNoteStore((state) => state.noteId)
  const isOpen = Boolean(isOpenForm && id)

  const actions = useEditNoteStore((state) => state.actions)

  const { data } = useGetNotesQuery()
  const currentNote = data?.notes.find((note) => note.id === id)
  const snapshotRef = useRef<NotePutIn | null>(null)

  const { control, handleSubmit, reset } = useForm<NotePutIn>({
    resolver: zodResolver(NotePutInSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  useEffect(() => {
    if (isOpen && currentNote) {
      snapshotRef.current = {
        title: currentNote.title,
        content: currentNote.content,
      }
      reset(snapshotRef.current)
    }
  }, [currentNote, reset, isOpen])

  const onSubmit: SubmitHandler<NotePutIn> = (formValues) => {
    const snapshot = snapshotRef.current

    const closeEditForm = () => {
      actions.setCloseEditForm()
      actions.removeId()
    }

    if (!id || !snapshot) {
      closeEditForm()
      return
    }

    const isChanged =
      formValues.title.trim() !== snapshot.title.trim() ||
      formValues.content.trim() !== snapshot.content.trim()

    if (isChanged) {
      editMutation.mutate({
        id,
        title: formValues.title?.trim() || '',
        content: formValues.content?.trim() || '',
      })
    }
    closeEditForm()
  }

  return {
    isOpen,
    control,
    handleSubmit,
    onSubmit,
    id,
  }
}
