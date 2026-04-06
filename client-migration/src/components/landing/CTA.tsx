import Link from 'next/link';

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden px-4 py-24"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <p className="rounded-full text-muted-foreground border border-muted-foreground/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em]">
          Stay in flow 
        </p>
        <h2 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Keep every outline, practice prompt, and capstone check-in together.
        </h2>
        <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
          CourseCraft is a solo build designed for honest coursework. No inflated numbers—just
          tools that help you design, share, and iterate on lessons without bouncing between
          apps.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Create a free account
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center rounded-full border border-muted-foreground/40 px-8 py-3 text-base font-semibold text-muted-foreground transition hover:bg-muted-foreground/10"
          >
            Explore the toolkit
          </Link>
        </div>
      </div>
    </section>
  );
}
