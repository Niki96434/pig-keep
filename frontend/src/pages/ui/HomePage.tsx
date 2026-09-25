import { AddNoteForm } from '@/features/add-note-form/ui/AddNoteForm'
import styles from './HomePage.module.css'
import { NoteList } from '@/entity/note/ui/NoteList'
import { EditNoteForm } from '@/features/edit-note-form/ui/EditNoteForm'

export function HomePage() {
  return (
    <div className={styles.container}>
      <AddNoteForm />
      <NoteList />
      <EditNoteForm />
    </div>
  )
}
