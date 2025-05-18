import { AppSidebar } from '@/components/layout.tsx/app-sidebar'
import { SiteHeader } from '@/components/layout.tsx/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/amu')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
      {/* <TanStackRouterDevtools /> */}
    </SidebarProvider>
  )
}
