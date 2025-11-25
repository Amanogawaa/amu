import { Navbar } from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  BookMarked,
  CheckCircle2,
  Compass,
  Layers,
  LayoutPanelLeft,
  PenTool,
  Sparkles,
  Timer,
} from 'lucide-react';

const featureHighlights = [
  {
    title: 'Instant Course Generator',
    description:
      'Type the topic or skill you want to learn and CourseCraft drafts a structured outline ready for refinement.',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Module & Lesson Canvas',
    description:
      'Edit lessons, rearrange sections, and add prompts from a clean interface that keeps everything in one place.',
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: 'Focused Practice Editor',
    description:
      'Experiment in a built-in code editor that supports vanilla HTML, CSS, and JavaScript without extra framework setup.',
    icon: <PenTool className="h-5 w-5" />,
  },
  {
    title: 'Capstone Tracking',
    description:
      'Guide students from idea to submission with simple milestones and galleries that show finished work.',
    icon: <LayoutPanelLeft className="h-5 w-5" />,
  },
  {
    title: 'Course Publishing',
    description:
      'Push a finished outline to Explore so other learners can enroll or keep it private for your own study plan.',
    icon: <BookMarked className="h-5 w-5" />,
  },
  {
    title: 'Progress Snapshots',
    description:
      'See which modules students complete and where they pause so you know what to improve next.',
    icon: <BarChart3 className="h-5 w-5" />,
  },
];

const workflowSteps = [
  {
    label: '01',
    title: 'Describe your course',
    detail:
      'Enter the topic students want to learn along with any goals. CourseCraft drafts the outline automatically.',
  },
  {
    label: '02',
    title: 'Refine with AI assists',
    detail:
      'Regenerate sections, insert quizzes, or ask for alternative explanations until everything feels right.',
  },
  {
    label: '03',
    title: 'Launch to students',
    detail:
      'Share a single link, invite your cohort, and monitor their pace from one dashboard.',
  },
  {
    label: '04',
    title: 'Iterate with insights',
    detail:
      'Usage data highlights confusing lessons so you can update content without pausing the course.',
  },
];

const supportFeatures = [
  {
    title: 'Solo-friendly workflow',
    body: 'Every tool was designed for a single creator, so there is no dependency on team invites or hand-offs.',
  },
  {
    title: 'Lightweight revisions',
    body: 'Adjust any module in place and regenerate specific lessons without touching the rest of the course.',
  },
  {
    title: 'Consistent student view',
    body: 'The same interface that generates content also renders it for learners, keeping expectations aligned.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen  text-foreground">
      <Navbar />
      <main className="bg-gradient-to-b from-background to-muted/40">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-24 pt-16 text-center">
            <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" />
              CSP411 solo thesis project
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Everything inside CourseCraft is built for student creators.
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
              From the first prompt to the final submission gallery, CourseCraft keeps student-friendly learning tools in one space so lessons stay consistent and easy to revisit.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="h-12 px-8 text-base">
                Start creating
              </Button>
            </div>
          </div>
        </section>

        <section className="px-6 pb-12">
          <div className="mx-auto grid w-full max-w-6xl gap-8">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-primary/80">
                Capabilities
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Everything you need to go from idea to published cohort
              </h2>
              <p className="mx-auto max-w-3xl text-base text-muted-foreground">
                Each feature solves the gritty details of course production so you can focus on clarity, pacing, and student impact.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {featureHighlights.map((feature) => (
                <article
                  key={feature.title}
                  className="group flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/70 p-6 transition hover:-translate-y-1 hover:border-primary/50 hover:bg-card/90"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/40 px-6 py-20">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row">
            <div className="flex-1 space-y-6">
              <p className="text-sm font-semibold text-primary">How it works</p>
              <h2 className="text-3xl font-semibold leading-tight">
                A four-step workflow designed around real instructor habits
              </h2>
              <p className="text-base text-muted-foreground">
                No complicated setup, just intentional guardrails that keep your course consistent. Each step is saved, versioned, and shareable with collaborators.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm">
                  <Timer className="h-4 w-4 text-primary" />
                  Draft-worthy in under 20 minutes
                </div>
                <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm">
                  <Compass className="h-4 w-4 text-primary" />
                  Built-in pacing suggestions
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {workflowSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-background font-semibold">
                    {step.label}
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
                Built-in support
              </p>
              <h2 className="text-3xl font-semibold">
                Designed with feedback from student mentors, faculty, and peer instructors
              </h2>
              <p className="text-base text-muted-foreground">
                CourseCraft keeps collaboration, accessibility, and safety at the core so every creator can stay confident while iterating.
              </p>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border/70 px-3 py-1">
                  Dark & light mode ready
                </span>
                <span className="rounded-full border border-border/70 px-3 py-1">
                  Keyboard shortcuts
                </span>
                <span className="rounded-full border border-border/70 px-3 py-1">
                  Audit-friendly exports
                </span>
              </div>
            </div>
            <div className="space-y-5">
              {supportFeatures.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-card/70 p-6"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
