"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/application/AuthContext";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { NavigationBarUser } from "./NavbarUser";
import { ModeToggle } from "../ThemeToggle";

export interface MenuItem {
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
}

const Navbar = ({
  logo = {
    url: "/",
    src: "/coursecraft.png",
    alt: "logo",
    title: "CourseCraft",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Features", url: "/features" },
    { title: "Glossary", url: "/glossary" },
  ],
  auth = {
    login: { title: "Login", url: "/signin" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: NavbarProps) => {
  const { user, loading } = useAuth();

  return (
    <section
      className={cn(
        "py-4 sticky top-0 border-b border-border/40 z-50 shadow-sm backdrop-blur-lg bg-background/30",
      )}
    >
      <div className="container max-w-7xl mx-auto">
        <nav className=" justify-between flex items-center px-4">
          <div className="flex items-center gap-6">
            <a
              href={!user ? logo.url : "/dashboard"}
              className="flex items-center gap-2"
            >
              <Image
                src={logo.src}
                className="max-h-8 dark:invert"
                alt={logo.alt}
                width={32}
                height={32}
              />
              {!user && (
                <span className="text-lg font-semibold tracking-tighter">
                  {logo.title}
                </span>
              )}
            </a>
            {!user && (
              <div className="hidden md:flex items-center">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>
          {/* <ModeToggle /> */}

          <div className="flex items-center gap-2">
            {!user && <MobileMenu menu={menu} user={user} auth={auth} />}
            {loading ? (
              <>
                <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
              </>
            ) : user ? (
              <NavigationBarUser />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button type="button" asChild variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button type="button" asChild size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </div>
            )}
          </div>
        </nav>
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
    <a
      key={item.title}
      href={item.url}
      className="block px-4 py-3 rounded-lg text-base font-semibold text-foreground hover:bg-secondary/10 transition-colors duration-200"
    >
      {item.title}
    </a>
  );
};

const MobileMenu = ({
  menu,
  user,
  auth,
}: {
  menu: MenuItem[];
  user: any;
  auth?: any;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Image
              src="/coursecraft.png"
              className="max-h-6 dark:invert"
              alt="CourseCraft"
              width={24}
              height={24}
            />
            <SheetTitle>CourseCraft</SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 px-2 py-6 space-y-1">
            {menu.map((item) => renderMobileMenuItem(item))}
          </div>
          {auth && (
            <div className="border-t border-border/60 px-4 py-6 space-y-3">
              <Button
                type="button"
                asChild
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <a href={auth.login.url}>{auth.login.title}</a>
              </Button>
              <Button
                type="button"
                asChild
                size="sm"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <a href={auth.signup.url}>{auth.signup.title}</a>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { Navbar };
