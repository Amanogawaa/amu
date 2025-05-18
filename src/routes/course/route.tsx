import { ChapterSidebar } from '@/components/course/layout/chapter-sidebar'
import { SiteHeader } from '@/components/layout.tsx/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/course')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <ChapterSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
      {/* <TanStackRouterDevtools /> */}
    </SidebarProvider>
  )
}
