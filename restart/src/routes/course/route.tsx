import { CourseSidebar } from "@/components/course/course-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/course")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <CourseSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
      {/* <TanStackRouterDevtools /> */}
    </SidebarProvider>
  );
}
