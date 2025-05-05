import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/$course-id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/amu/course/$course-id"!</div>
}
