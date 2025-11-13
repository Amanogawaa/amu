'use client';

import {
  BellIcon,
  ChevronDownIcon,
  LogOutIcon,
  ShoppingBag,
  UserCircleIcon,
  Settings,
  BookOpen,
  Kanban,
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
import { useAuth } from '@/features/auth/application/AuthContext';

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
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-accent hover:text-accent-foreground transition duration-300 rounded-full text-foreground">
        <Avatar className="h-10 w-10 border-2 border-primary/20">
          <span className="sr-only">User Avatar</span>
          <AvatarImage
            src={user?.photoURL || '/profile_1.png'}
            alt={name || 'User'}
          />
          <AvatarFallback>
            {name?.charAt(0).toUpperCase() ||
              email?.charAt(0).toUpperCase() ||
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
            <Link href={'/my-learning'}>
              <BookOpen className="mr-2 h-4 w-4" />
              My Learning
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
          <DropdownMenuItem
            asChild
            className="text-foreground hover:text-foreground hover:bg-accent focus:bg-accent focus:text-foreground"
          >
            <Link href={'/courses'}>
              <Kanban className="mr-2 h-4 w-4" />
              Courses
            </Link>
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
