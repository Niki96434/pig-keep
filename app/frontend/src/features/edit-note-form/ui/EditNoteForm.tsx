import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NotePutInSchema } from '@shared/notes/validationSchemas'
import type { NotePutIn } from '@shared/notes/types'
import { useEditNoteMutation } from '../api/useEditNoteMutation'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'
import { useGetNotesQuery } from '@/entity/note/api/useGetNotes'
import { NoteForm } from '@/entity/note/ui/NoteForm'
import styles from './EditNoteForm.module.css'

function EditNoteForm() {
  const editMutation = useEditNoteMutation()
  const isOpenForm = useEditNoteStore((state) => state.isOpenEditForm)
  const id = useEditNoteStore((state) => state.noteId)
  const actions = useEditNoteStore((state) => state.actions)

  const { data } = useGetNotesQuery()
  const currentNote = data?.notes.find((note) => note.id === id)

  const { control, handleSubmit, reset, getValues } = useForm<NotePutIn>({
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

  const onSubmit = useCallback(() => {
    const formValues = getValues()
    if (id && (formValues.title?.trim() !== '' || formValues.content?.trim() !== '')) {
      editMutation.mutate({
        id,
        title: formValues.title?.trim() || '',
        content: formValues.content?.trim() || '',
      })
    }
    closeEditForm()
  }, [id, getValues, editMutation, closeEditForm])

  if (!isOpenForm || !id) return null

  return (
    <div className={styles.background} onClick={handleSubmit(onSubmit)}>
      <div className="w-full max-w-150 mx-4" onClick={(e) => e.stopPropagation()}>
        <NoteForm control={control} onSubmit={handleSubmit(onSubmit)} />
      </div>
    </div>
  )
}

export { EditNoteForm }
