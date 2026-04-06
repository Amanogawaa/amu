import { FolderTree, LayoutList, MessageSquare, NotebookPen, Puzzle, Rocket, Target } from "lucide-react";

const steps = [
  {
    step: '1',
    title: 'Choose your topic',
    desc: 'Pick the subject you want to explore or teach.',
    icon: <Target className="h-5 w-5" />,
    detail: 'Use the same prompts written for the CSP411 thesis runs.',
  },
  {
    step: '2',
    title: 'Describe the goals',
    desc: 'Add learner level, timeline, and desired outcomes.',
    icon: <NotebookPen className="w-5 h-5"/>,
    detail: 'CourseCraft drafts a structured outline instantly.',
  },
  {
    step: '3',
    title: 'Refine modules',
    desc: 'Reorder lessons, insert optional quizzes, and jot inline notes.',
    icon: <FolderTree className="w-5 h-5"/>,
    detail: 'Everything lives in one editing canvas.',
  },
  {
    step: '4',
    title: 'Share & iterate',
    desc: 'Publish to learners, gather capstones, and tweak pacing.',
    icon: <Rocket className="w-5 h-5"/>,
    detail: 'Adjust based on real submissions and reflections.',
  },
];

const cards = [
  {
    icon: <MessageSquare className="w-5 h-5"/>,
    title: 'Inline reminders',
    desc: 'Store hints, timing notes, or demo scripts beside each activity.',
  },
  {
    icon: <Puzzle className="w-5 h-5"/>,
    title: 'Generated quizzes',
    desc: 'Short checks that students can take or skip—perfect for self-review.',
  },
  {
    icon: <LayoutList className="w-5 h-5"/>,
    title: 'Capstone gallery',
    desc: 'Finished work sits in one place with screenshots and notes.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white px-4 py-24 text-custom-foreground">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
            Simple process
          </span>
          <h2 className="text-4xl font-bold sm:text-5xl">
            How <span className="text-primary">CourseCraft</span> Works
          </h2>
          <p className="text-lg text-muted-foreground">
            The same loop used to build the thesis project—grounded, repeatable, and honest.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-2xl">
                {step.icon}
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary">
                Step {step.step}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
              <div className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm font-medium text-primary">
                {step.detail}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <div className="mb-3 text-3xl flex items-center justify-center">{card.icon}</div>
              <h4 className="text-lg font-semibold text-foreground">{card.title}</h4>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

