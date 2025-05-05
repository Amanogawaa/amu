import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/amu/community")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/course/community"!</div>;
}
