import NotFoundPage from "@/components/not-found";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import React from "react";

export const Route = createRootRoute({
  errorComponent: () => {
    <NotFoundPage />;
  },
  component: () => (
    <React.Fragment>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </React.Fragment>
  ),
});
