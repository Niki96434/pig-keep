import { SidebarProvider, SidebarTrigger, AppSidebar } from '@/shared/ui'

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar className="shadow-md" />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Sidebar
