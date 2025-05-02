import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/course/community")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/course/community"!</div>;
}
