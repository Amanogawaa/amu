import Link from 'next/link';

const highlights = [
  'Prompt → full outline',
  'Drag modules into order',
  'Share capstones with one link',
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background/40 to-secondary/10 px-4 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-10 right-1/5 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6 text-center lg:text-left">
        
          <h1 className="text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
            Draft a complete course in minutes, then refine every lesson your way.
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            CourseCraft keeps prompts, outlines, practice steps, and capstone submissions in
            one workspace. It&apos;s built for student creators who want structure without a
            huge production team.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Generate a course
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3 text-base font-semibold text-foreground transition hover:bg-foreground/5"
            >
              Learn the story
            </Link>
          </div>

         
        </div>

        <div className="flex-1">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl backdrop-blur">
            <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Course preview</span>
              <span>Auto-saved</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background/90 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">Outline</p>
                <p className="text-lg font-semibold text-foreground">
                  Build Your First Web Dashboard
                </p>
                <p className="text-sm text-muted-foreground">
                  Generated for: beginner · 4 modules · capstone ready
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/90 p-4">
                <p className="text-xs font-semibold text-primary">Module 02 · Layouts</p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• Lesson: CSS grid with live preview prompt</li>
                  <li>• Practice: Customize the navigation shell</li>
                  <li>• Checkpoint: Upload a screenshot for feedback</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/90 p-4">
                <p className="text-xs font-semibold text-primary">Capstone marker</p>
                <p className="text-sm text-muted-foreground">
                  Students submit final dashboards with notes and screenshots. Everything is
                  stored in the same thread so you can review quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
