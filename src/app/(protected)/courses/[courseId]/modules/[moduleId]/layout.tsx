import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ModuleChapterSidebar } from '@/features/modules/presentation/ModuleChapterSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex w-full justify-center">
        <div className="flex w-full max-w-7xl">
          <ModuleChapterSidebar className="border-r" />
          <SidebarInset className="flex-1 min-h-screen">
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
