import { AddNoteForm } from '@/features/add-note-form/ui/AddNoteForm'
import styles from './HomePage.module.css'
import { NoteList } from '@/entities/note/ui/NoteList'
import { EditNoteForm } from '@/features/edit-note-form/ui/EditNoteForm'
import SearchInput from '@/features/fulltext-search/ui/SearchInput'

export function HomePage() {
  return (
    <div className={styles.container}>
      <SearchInput />
      <AddNoteForm />
      <NoteList />
      <EditNoteForm />
    </div>
  )
}
