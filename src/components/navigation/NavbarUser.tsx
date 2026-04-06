"use client";

import {
  BookOpen,
  GraduationCap,
  Kanban,
  LogOutIcon,
  Menu,
  Plus,
  User,
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
} from "@/src/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useAuthActions } from "@convex-dev/auth/react";

export function NavigationBarUser() {
  const { user } = useAuth();
  const { signOut } = useAuthActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none p-2 bg-white hover:bg-accent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-accent-foreground hover:text-white transition ">
        <Menu className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border shadow-sm"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-4 py-1.5 text-left text-sm">
            <div className="flex flex-1 text-left text-sm leading-tight">
              <User className="mr-2 h-4 w-4 " />
              <span className="truncate text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/create"}
              className="group flex items-center cursor-pointer"
            >
              <Plus className="mr-2 h-4 w-4 " />
              Create
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/dashboard"}
              className="group flex items-center cursor-pointer"
            >
              <Kanban className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/learn"}
              className="group flex items-center cursor-pointer"
            >
              <GraduationCap className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Learn
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/account"}
              className="group flex items-center cursor-pointer"
            >
              <UserCircleIcon className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/my-learning"}
              className="group flex items-center cursor-pointer"
            >
              <BookOpen className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              My Learning
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-md">
            <Link
              href={"/courses"}
              className="group flex items-center cursor-pointer"
            >
              <Kanban className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
              Courses
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={signOut} className="group rounded-md">
          <LogOutIcon className="mr-2 h-4 w-4 group-hover:text-primary group-focus:text-primary" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
