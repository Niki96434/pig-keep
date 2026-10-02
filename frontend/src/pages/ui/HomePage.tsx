import { AddNoteForm } from '@/features/add-note-form'
import styles from './HomePage.module.css'
import { NoteList } from '@/entities/note'
import { EditNoteForm } from '@/features/edit-note-form'
import { SearchInput } from '@/features/fulltext-search'
import { Sidebar } from '@/widgets/sidebar'

export function HomePage() {
  return (
    <div className={styles.container}>
      <Sidebar>
        <div className={styles.content}>
          <SearchInput />
          <AddNoteForm />
          <NoteList />
          <EditNoteForm />
        </div>
      </Sidebar>
    </div>
  )
}
