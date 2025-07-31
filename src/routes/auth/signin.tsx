import { createFileRoute } from '@tanstack/react-router'
import { SigninForm } from '@/components/forms/signin-form'

export const Route = createFileRoute('/auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center rounded-lg">
      <div className="flex max-w-4xl items-center">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto w-[350px] gap-6">
            <SigninForm />
          </div>
        </div>
      </div>
    </main>
  )
}
