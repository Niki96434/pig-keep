import { AddNoteForm } from '@/features/add-note-form'
import styles from './HomePage.module.css'
import { EditNoteForm } from '@/features/edit-note-form'
import { SearchInput } from '@/features/fulltext-search'
import { ManageTagsModal } from '@/features/manage-tags'
import { Sidebar } from '@/widgets/sidebar'
import { Outlet, useLocation } from 'react-router'

export function HomePage() {
  const location = useLocation()
  const isArchivePage = location.pathname.startsWith('/archive')
  const isDeletedPage = location.pathname.startsWith('/deleted')
  const showAddNoteForm = !isArchivePage && !isDeletedPage

  return (
    <div className={styles.container}>
      <Sidebar>
        <div className={styles.content}>
          <div className={styles.searchWrapper}>
            <SearchInput />
          </div>

          <div className={styles.mainLayout}>
            <div className={styles.notesSection}>
              {showAddNoteForm && <AddNoteForm />}
              <EditNoteForm />
              <ManageTagsModal />
              <Outlet />
            </div>
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
