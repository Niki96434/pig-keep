import { useEditNoteMutation } from '../api/useEditNoteMutation'
import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'
import styles from './EditNoteForm.module.css'

function EditNoteForm() {
  const editMutation = useEditNoteMutation()
  const isOpenForm = useEditNoteStore((state) => state.isOpenEditForm)
  const id = useEditNoteStore((state) => state.noteId)

  if (!isOpenForm || !id) return null
  return (
    <>
      {isOpenForm && (
        <form
          className={styles.container}
          onClick={() => editMutation.mutate({ id, ...props })}
        ></form>
      )}
    </>
  )
}

export { EditNoteForm }
