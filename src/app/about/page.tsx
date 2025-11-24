import { Navbar } from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Brain, HeartHandshake, Lightbulb, Target, Wand2 } from 'lucide-react';

const pillars = [
  {
    title: 'Clarity first',
    description:
      'Every screen focuses on the next learning task so students always know what to tackle and why it matters.',
    icon: <Lightbulb className="h-5 w-5" />,
  },
  {
    title: 'Human + AI partnership',
    description:
      'AI accelerates the rough draft while the instructor adds context, story, and pacing to keep things relatable.',
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: 'Proof over promises',
    description:
      'Each release is tested inside CSP411 with real coursework before it shows up in the public interface.',
    icon: <Target className="h-5 w-5" />,
  },
];

const teamCards = [
  {
    title: 'Who it serves',
    detail:
      'Students who want to learn something specific and need a structured course without waiting for an official curriculum.',
  },
  {
    title: 'Why it exists',
    detail:
      'The thesis project started as a way to reduce prep time for study sessions while keeping the material hands-on.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="bg-gradient-to-b from-background to-muted/40">
        <section className="relative overflow-hidden px-6 py-20">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" />
          <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              <Wand2 className="h-4 w-4" />
              About CourseCraft
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              CourseCraft helps learners ship polished projects—even on tight schedules.
            </h1>
            <p className="text-lg text-muted-foreground">
              CourseCraft grew out of frustration with endless prep docs, scattered slides, and duplicated effort. It aims to remember every requirement, keep lessons aligned, and let learners focus on doing the work.
            </p>
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <a href="/features">See the feature tour</a>
            </Button>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[2fr,3fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary/80 uppercase tracking-[0.3em]">
                Mission
              </p>
              <h2 className="text-3xl font-semibold">
                Empower students to outline meaningful courses in days, not semesters.
              </h2>
              <p className="text-base text-muted-foreground">
                The best instruction is specific, generous, and grounded in real coursework. CourseCraft handles the orchestration—objectives, pacing, assessments—so the creator can focus on storytelling and community.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border/60 px-3 py-1">
                  AI-assisted outlines
                </span>
                <span className="rounded-full border border-border/60 px-3 py-1">
                  Course-based milestones
                </span>
                <span className="rounded-full border border-border/60 px-3 py-1">
                  Inclusive defaults
                </span>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {teamCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-border/70 bg-card/70 p-6"
                >
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{card.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/40 px-6 py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">
            <div className="flex-1 space-y-4">
              <p className="text-sm font-semibold text-primary">Our pillars</p>
              <h2 className="text-3xl font-semibold">
                Decisions that guide every product sprint
              </h2>
              <p className="text-base text-muted-foreground">
                These principles keep the solo roadmap focused and make sure each release helps real learners—especially those just starting their tech journey.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 px-6 py-16 text-muted-foreground">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 text-center">
            <HeartHandshake className="mx-auto h-10 w-10" />
            <h2 className="text-3xl font-semibold text-custom_foreground">Created by a student for students</h2>
            <p className="text-lg text-muted-foreground">
              CourseCraft started inside the Gordon College as Dominic Molino&apos;s thesis project. Every feature reflects that studio mindset—building tools that make quality education accessible for first-time coders.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
