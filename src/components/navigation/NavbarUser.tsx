'use client';

import { BookOpen, Kanban, LogOutIcon, UserCircleIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth/application/AuthContext';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function NavigationBarUser() {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground transition duration-300 rounded-full text-foreground">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <span className="sr-only">User Avatar</span>
          <AvatarImage
            src={user?.photoURL || '/profile_1.png'}
            alt={user?.displayName || 'User'}
          />
          <AvatarFallback>
            {user?.displayName?.charAt(0).toUpperCase() ||
              user?.email?.charAt(0).toUpperCase() ||
              'U'}
          </AvatarFallback>
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
                {user?.displayName || 'User'}
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
            <Link href={'/account'} className="group">
              <UserCircleIcon className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              Account
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={'/my-learning'} className="group">
              <BookOpen className="mr-2 h-4 w-4 group-hover:text-accent-foreground group-focus:text-accent-foreground" />
              My Learning
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={'/courses'} className="group">
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
