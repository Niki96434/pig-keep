import { AddNoteForm } from '@/features/add-note-form'
import styles from './HomePage.module.css'
import { EditNoteForm } from '@/features/edit-note-form'
import { SearchInput } from '@/features/fulltext-search'
import { ManageTagsModal } from '@/features/manage-tags'
import { Sidebar } from '@/widgets/sidebar'
import { Outlet, useLocation } from 'react-router'
import { PetCard, useGetPetQuery } from '@/entities/pet'

export function HomePage() {
  const location = useLocation()
  const isArchivePage = location.pathname.startsWith('/archive')
  const isDeletedPage = location.pathname.startsWith('/deleted')
  const showAddNoteForm = !isArchivePage && !isDeletedPage

  const { data: petData } = useGetPetQuery()
  const pet = petData?.pet

  return (
    <div className={styles.container}>
      <Sidebar>
        <div className={styles.content}>
          <div className={styles.searchWrapper}>
            <SearchInput />
          </div>

          <div className={styles.mainLayout}>
            <aside className={styles.petSidebar}>
              <PetCard pet={pet} />
            </aside>
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
