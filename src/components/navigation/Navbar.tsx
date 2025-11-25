'use client';

import { Menu, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/features/auth/application/AuthContext';
import { NavigationBarUser } from './NavbarUser';
import Image from 'next/image';
import { ModeToggle } from '../ThemeToggle';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
  smartHide?: boolean;
}

const Navbar = ({
  logo = {
    url: '/',
    src: '/coursecraft.png',
    alt: 'logo',
    title: 'CourseCraft',
  },
  menu = [
    { title: 'Home', url: '/' },
    { title: 'Explore', url: '/explore' },
    { title: 'Features', url: '/features' },
    { title: 'About', url: '/about' },
  ],
  auth = {
    login: { title: 'Login', url: '/signin' },
    signup: { title: 'Sign up', url: '/signup' },
  },
  smartHide = false,
}: NavbarProps) => {
  const { user, signOut, loading } = useAuth();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!smartHide) {
      return;
    }

    const handleScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;

      if (current < 80) {
        setIsHidden(false);
      } else if (delta > 5) {
        setIsHidden(true);
      } else if (delta < -5) {
        setIsHidden(false);
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [smartHide]);

  return (
    <section
      className={cn(
        'py-4 sticky top-0 backdrop-blur-lg bg-background/30 border-b border-border/40 z-50 shadow-sm',
        smartHide &&
          'transition-transform duration-300 ease-out will-change-transform',
        smartHide && (isHidden ? '-translate-y-full' : 'translate-y-0')
      )}
    >
      <div className="container max-w-7xl mx-auto">
        {/* Desktop Menu */}
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
              </div>
            ) : user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="outline" className="rounded-full py-5">
                  <a href="/create">Create</a>
                  {/* <Plus size={45} /> */}
                </Button>
                <NavigationBarUser
                  name={user.displayName ?? user.uid}
                  email={user.email}
                  logout={signOut}
                />
              </div>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
              />
            </a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex w-full flex-col gap-4">
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {loading ? (
                      // Show placeholder while loading
                      <>
                        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                      </>
                    ) : user ? (
                      <>
                        <Button asChild variant="outline">
                          <a href="/create">Create</a>
                        </Button>
                        <Button asChild>
                          <a href="/profile">Profile</a>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <a href={auth.login.url}>{auth.login.title}</a>
                        </Button>
                        <Button asChild>
                          <a href={auth.signup.url}>{auth.signup.title}</a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="bg-transparent hover:bg-transparent hover:text-accent data-[active=true]:focus:bg-transparent active:bg-transparent focus:bg-transparent focus:text-accent active:text-accent inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:underline"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };
