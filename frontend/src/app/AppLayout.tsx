import { SidebarProvider, AppSidebar } from '@/shared/ui'
import { Header } from '@/widgets/navbar'
import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <SidebarProvider className="flex flex-col min-h-screen w-full bg-background">
      <Header />
      <div className="flex flex-1 w-full min-h-0 relative">
        <AppSidebar />
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 flex flex-col gap-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AppLayout
