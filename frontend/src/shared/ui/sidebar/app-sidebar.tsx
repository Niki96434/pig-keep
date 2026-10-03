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
import { Archive, Bookmark, NotebookPen, Pencil, TextAlignJustify, Trash } from 'lucide-react'

type NavItem = {
  title: string
  url: string
  tag?: boolean
  items?: {
    title: string
    url: string
    isActive?: boolean
  }[]
}

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: 'Заметки',
      url: '#',
    },
    {
      title: 'Создать ярлык',
      url: '#',
    },
    {
      title: 'ДЗ',
      url: '#',
      tag: true,
    },
    {
      title: 'Быт',
      url: '#',
      tag: true,
    },
    {
      title: 'Дачные дела',
      url: '#',
      tag: true,
    },
    {
      title: 'Архив',
      url: '#',
    },
    {
      title: 'Удаленные',
      url: '#',
    },
  ],
}

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
                <span className="">v1.0.0</span>
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
            {data.navMain.map(
              (item) =>
                item.tag && (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      render={<Link to="/tags/:tagId" className="font-medium" />}
                    >
                      <Bookmark className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
            )}
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
