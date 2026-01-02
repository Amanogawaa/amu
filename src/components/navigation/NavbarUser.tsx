"use client";

import {
  BookOpen,
  GraduationCap,
  Kanban,
  LogOutIcon,
  Menu,
  Plus,
  UserCircleIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/application/AuthContext";
import Link from "next/link";

export function NavigationBarUser() {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border border-secondary p-2 bg-white hover:bg-accent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-accent-foreground hover:text-white  transition">
        <Menu className="w-5 h-5  " />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-4 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium w-[20ch] text-foreground">
                {user?.displayName || "User"}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/create"} className="group">
              <Plus className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Create
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"} className="group">
              <Kanban className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/learn"} className="group">
              <GraduationCap className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Learn
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/account"} className="group">
              <UserCircleIcon className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/my-learning"} className="group">
              <BookOpen className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              My Learning
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={"/courses"} className="group">
              <Kanban className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Courses
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={() => signOut()} className="group">
          <LogOutIcon className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
