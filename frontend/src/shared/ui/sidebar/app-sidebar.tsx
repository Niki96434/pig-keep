import * as React from 'react'
import { Link } from 'react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar/sidebar'
import { Archive, NotebookPen, Pencil, TextAlignJustify, Trash } from 'lucide-react'
import { TagList } from '@/widgets/sidebar'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TextAlignJustify className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">Pig Keep</span>
                <span>v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Заметки" render={<Link to="/" className="font-medium" />}>
                <NotebookPen className="size-4" />
                <span>Заметки</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Создать тег"
                render={<Link to="/create-tags" className="font-medium" />}
              >
                <Pencil className="size-4" />
                <span>Создать тег</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <TagList />
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Архив"
                render={<Link to="/archive" className="font-medium" />}
              >
                <Archive className="size-4" />
                <span>Архив</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Удаленные"
                render={<Link to="/deleted" className="font-medium" />}
              >
                <Trash className="size-4" />
                <span>Удаленные</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
