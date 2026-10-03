import { Link } from 'react-router'
import { Bookmark } from 'lucide-react'
import { useGetTagsQuery } from '@/entities/tag'
import { SidebarMenuItem, SidebarMenuButton } from '@/shared/ui/sidebar/sidebar'

export function TagList() {
  const { data } = useGetTagsQuery()

  if (!data?.tags?.length) {
    return null
  }

  return (
    <>
      {data.tags.map((tag) => (
        <SidebarMenuItem key={tag.id}>
          <SidebarMenuButton
            tooltip={tag.name}
            render={<Link to={`/tags/${tag.id}`} className="font-medium" />}
          >
            <Bookmark className="size-4" />
            <span>{tag.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  )
}
