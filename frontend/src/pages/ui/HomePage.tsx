import { AddNoteForm } from '@/features/add-note-form'
import styles from './HomePage.module.css'
import { Outlet, useLocation } from 'react-router'
import { lazy } from 'react'

const EditNoteForm = lazy(() =>
  import('@/features/edit-note-form').then((m) => ({ default: m.EditNoteForm }))
)

const ManageTagsModal = lazy(() =>
  import('@/features/manage-tags').then((m) => ({ default: m.ManageTagsModal }))
)

export function HomePage() {
  const location = useLocation()
  const isArchivePage = location.pathname.startsWith('/archive')
  const isDeletedPage = location.pathname.startsWith('/deleted')
  const showAddNoteForm = !isArchivePage && !isDeletedPage

  return (
    <div className={styles.notesSection}>
      {showAddNoteForm && <AddNoteForm />}
      <EditNoteForm />
      <ManageTagsModal />
      <Outlet />
    </div>
  )
}
