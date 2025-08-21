import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/_layouts/app-header";
import { AppSidebar } from "@/components/_layouts/app-sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Amu",
  icons: { icon: "/convex.svg" },
};

export default async function AmuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  const { data: user } = await supabase.auth.getUser();

  if (!session || error) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
