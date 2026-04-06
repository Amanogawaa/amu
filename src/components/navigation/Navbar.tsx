"use client";

import Image from "next/image";
import { NavigationBarUser } from "./NavbarUser";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";

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
    login: { title: "Login", url: "/sign-in" },
    signup: { title: "Sign up", url: "/sign-up" },
  },
}: NavbarProps) => {
  const { user, isLoading } = useAuth();

  return (
    <section
      className={cn(
        "py-3 sticky top-0 border-b border-border/40 z-50 shadow-sm backdrop-blur-lg bg-background/30",
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
              <div className="flex items-center ">
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((item) => renderMenuItem(item))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <div className="h-9 w-20 bg-muted animate-pulse rounded-md" />
                <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
              </>
            ) : user ? (
              <NavigationBarUser />
            ) : (
              <>
                <Button type="button" variant="outline" size="sm">
                  <a href={auth.login.url}>{auth.login.title}</a>
                </Button>
                <Button type="button" size="sm">
                  <a href={auth.signup.url}>{auth.signup.title}</a>
                </Button>
              </>
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
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar };
