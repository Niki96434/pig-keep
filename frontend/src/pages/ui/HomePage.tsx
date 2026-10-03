import { AddNoteForm } from '@/features/add-note-form'
import styles from './HomePage.module.css'
import { EditNoteForm } from '@/features/edit-note-form'
import { SearchInput } from '@/features/fulltext-search'
import { ManageTagsModal } from '@/features/manage-tags'
import { Sidebar } from '@/widgets/sidebar'
import { Outlet } from 'react-router'

export function HomePage() {
  return (
    <div className={styles.container}>
      <Sidebar>
        <div className={styles.content}>
          <SearchInput />
          <AddNoteForm />
          <EditNoteForm />
          <ManageTagsModal />
          <Outlet />
        </div>
      </Sidebar>
    </div>
  )
}
