import CourseCard from '@/components/amu/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/amu/my-course')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex h-full w-full flex-col">
      <CourseCard />
    </main>
  )
}
