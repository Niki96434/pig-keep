import { SearchInput } from '@/features/fulltext-search'
import styles from './Header.module.css'
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/shared/ui'
import { useSidebar } from '@/shared/hooks'
import pigLogo from '@/shared/assets/pig-snout.svg'

export function Header() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className={styles.header}>
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              aria-label="Главное меню"
              title="Главное меню"
              className="size-12 justify-center p-0!"
            >
              <img src={pigLogo} className="size-30 shrink-0" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className={styles.searchWrapper}>
        <SearchInput />
      </div>
      <div className="w-10 shrink-0" />
    </header>
  )
}

export default Header
