import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/suggestion')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/course/suggestion"!</div>
}
