import { NoteForm } from '@/entity/note/ui/NoteForm'
import styles from './EditNoteForm.module.css'
import { useEditNoteForm } from '../model/useEditNoteForm'

function EditNoteForm() {
  const { isOpen, control, handleSubmit, onSubmit, id } = useEditNoteForm()

  if (!isOpen || !id) return null

  return (
    <div className={styles.background} onClick={handleSubmit(onSubmit)}>
      <div className="w-full max-w-150 mx-4" onClick={(e) => e.stopPropagation()}>
        <NoteForm control={control} onSubmit={handleSubmit(onSubmit)} />
      </div>
    </div>
  )
}

export { EditNoteForm }
