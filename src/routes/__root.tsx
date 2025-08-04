/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./../global.css";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Amu",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => (
    <div className="min-h-svh w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center gap-4 p-4">
        <h1 className="text-4xl font-bold font-satoshi text-stone-700">
          Page Not Found
        </h1>
        <p className="text-lg font-inter text-stone-500 max-w-80 font-medium">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-Evergreen_Dusk rounded-2xl cursor-pointer py-3 px-5 text-sm font-inter font-semibold text-white hover:bg-custom_foreground/80 hover:ease-in"
        >
          Go Home
        </Link>
      </div>
    </div>
  ),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
