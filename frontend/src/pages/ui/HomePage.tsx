import { NoteForm } from '@/features/add-note-form/ui/NoteForm'
import styles from './HomePage.module.css'
import { NoteList } from '@/entity/note/ui/NoteList'

export function HomePage() {
  return (
    <div className={styles.container}>
      <NoteForm />
      <NoteList />
    </div>
  )
}
