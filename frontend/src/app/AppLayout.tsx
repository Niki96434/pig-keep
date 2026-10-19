import styles from './AppLayout.module.css'
import { Sidebar } from '@/widgets/sidebar'
import { SearchInput } from '@/features/fulltext-search'
import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className={styles.container}>
      <Sidebar>
        <div className={styles.content}>
          <header className={styles.searchWrapper}>
            <SearchInput />
          </header>
          <div className={styles.mainLayout}>
            <Outlet />
          </div>
        </div>
      </Sidebar>
    </div>
  )
}
