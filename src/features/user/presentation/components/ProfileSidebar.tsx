"use client";

import { cn } from "@/lib/utils";
import { BarChart3, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  {
    title: "Profile",
    href: "/account",
    icon: User,
    description: "View and edit your profile",
  },
  {
    title: "Analytics",
    href: "/account/analytics",
    icon: BarChart3,
    description: "Track your learning progress",
  },
  {
    title: "Settings",
    href: "/account/settings",
    icon: Settings,
    description: "Manage privacy and preferences",
  },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <nav className="lg:hidden flex gap-4 overflow-x-auto mb-6 border-b">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-1 py-3 whitespace-nowrap transition-all border-b-2",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <nav className="hidden lg:block space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 px-3 py-3 transition-all border-l-2",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
