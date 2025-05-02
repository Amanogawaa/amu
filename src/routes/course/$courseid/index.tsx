import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/course/$courseid/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseid } = useParams({ strict: false });

  return <div>Hello "/course/$courseid/"!</div>;
}
