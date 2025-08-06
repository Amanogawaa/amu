import CourseCard from "@/components/course-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/amu/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex h-full w-full flex-col">
      <CourseCard />
    </main>
  );
}
