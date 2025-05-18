import { ChapterContent } from '@/components/course/layout/chapter-contents'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="w-full h-full flex  px-3 py-5 ">
      <ChapterContent />
      {/* <Outlet /> */}
    </section>
  )
}
