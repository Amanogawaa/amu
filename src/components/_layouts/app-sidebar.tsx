import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Cog,
  Handshake,
  Library,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { NavMain } from "./app-main";
import SignOutButton from "./app-user";

const data = {
  user: {
    name: "domsiroll",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "courses",
      url: "/amu/courses",
      icon: Library,
    },
    {
      title: "community",
      url: "/amu/community",
      icon: Handshake,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Cog,
    },

    {
      title: "Get Help",
      url: "#",
      icon: MessageCircleQuestionIcon,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: { user: object } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 ">
              <>
                {/* <IconInnerShadowTop className="!size-5" /> */}
                <span className="text-base font-semibold">amu ai</span>
              </>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
