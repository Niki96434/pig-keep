import * as React from 'react'
import { Link, useLocation } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar/sidebar'
import { Archive, NotebookPen, Pencil, Trash } from 'lucide-react'
import { TagList } from '@/widgets/sidebar'
import { useTagsModalStore } from '@/stores/manage-tags/tagsModalStore'
import { useSidebar } from '@/shared/hooks'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const openTagsModal = useTagsModalStore((state) => state.open)
  const { isMobile, setOpenMobile } = useSidebar()
  const location = useLocation()

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const handleOpenTagsModal = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
    openTagsModal()
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarMenu className="gap-1.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Заметки"
                isActive={location.pathname === '/'}
                onClick={handleNavClick}
                render={<Link to="/" className="font-medium" />}
              >
                <NotebookPen className="size-5.5 shrink-0" />
                <span>Заметки</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Создать тег"
                onClick={handleOpenTagsModal}
                className="font-medium cursor-pointer"
              >
                <Pencil className="size-5.5 shrink-0" />
                <span>Создать тег</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <TagList onTagClick={handleNavClick} />
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Архив"
                isActive={location.pathname.startsWith('/archive')}
                onClick={handleNavClick}
                render={<Link to="/archive" className="font-medium" />}
              >
                <Archive className="size-5.5 shrink-0" />
                <span>Архив</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Удаленные"
                isActive={location.pathname.startsWith('/deleted')}
                onClick={handleNavClick}
                render={<Link to="/deleted" className="font-medium" />}
              >
                <Trash className="size-5.5 shrink-0" />
                <span>Удаленные</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
