'use client';

import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  ShoppingBag,
  UserCircleIcon,
  Settings,
  BookOpen,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface NavigationBarUserProps {
  name: string | null;
  email: string | null;
  logout: () => void;
}

export function NavigationBarUser({
  name,
  email,
  logout,
}: NavigationBarUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground transition duration-300 rounded-full text-foreground">
        <Avatar className="h-10 w-10 ">
          <span className="sr-only">User Avatar</span>
          <AvatarImage />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-popover border-border"
        // side="right"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-4 py-1.5 text-left text-sm">
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium w-[20ch] text-foreground">
                {name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
          >
            <Link href={'/account'}>
              <UserCircleIcon className="mr-2 h-4 w-4" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
          >
            <Link href={'/courses'}>
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </Link>
          </DropdownMenuItem>
          {/* {isAdmin && (
            <DropdownMenuItem
              asChild
              className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
            >
              <Link href={'/admin'}>
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground">
            <BellIcon className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={() => logout()}
          className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
