const steps = [
  {
    step: '1',
    title: 'Choose Your Topic',
    desc: 'Python, JavaScript, Web Dev, and more',
    icon: '🎯',
    detail: 'Select from 50+ topics',
  },
  {
    step: '2',
    title: 'Set Your Level',
    desc: 'Absolute beginner to intermediate',
    icon: '📊',
    detail: 'Personalized difficulty',
  },
  {
    step: '3',
    title: 'Get Your Course',
    desc: 'Generated in seconds, just for you',
    icon: '⚡',
    detail: 'AI-powered curriculum',
  },
  {
    step: '4',
    title: 'Learn & Grow',
    desc: 'With exercises, projects, and 24/7 help',
    icon: '🚀',
    detail: 'Track your progress',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 px-4 bg-gradient-to-br from-evergreen-dusk via-evergreen-dusk to-custom-foreground text-white overflow-hidden"
    >
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-winter-teal rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-winter-teal rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 mb-4 bg-winter-teal/20 rounded-full text-sm font-medium">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-winter-teal">Amu</span> Works
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From zero to coding hero in just 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-winter-teal to-winter-teal/20" />
              )}

              <div className="relative text-center group">
                {/* Number badge with animation */}
                <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-winter-teal to-winter-teal/80 rounded-2xl mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl animate-pulse" />
                  <span className="relative text-4xl font-bold">{s.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-evergreen-dusk font-bold text-sm shadow-lg">
                    {s.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-winter-teal transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-300 mb-2 leading-relaxed">{s.desc}</p>
                <p className="text-sm text-winter-teal/80 font-medium">
                  {s.detail}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-winter-teal/0 group-hover:border-winter-teal/30 rounded-2xl transition-all duration-300 -z-10 scale-105" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-sm px-8 py-6 rounded-2xl border border-white/20">
            <div className="text-left">
              <div className="text-2xl font-bold mb-1">
                Ready in 30 seconds ⚡
              </div>
              <div className="text-gray-300">
                No installation, no setup, just start learning
              </div>
            </div>
            <button className="whitespace-nowrap bg-winter-teal hover:bg-white hover:text-evergreen-dusk text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Try it Free →
            </button>
          </div>
        </div>

        {/* Additional features showcase */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div className="text-3xl mb-3">💡</div>
            <div className="font-semibold mb-1">Smart Hints</div>
            <div className="text-sm text-gray-300">
              Get unstuck with context-aware tips
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div className="text-3xl mb-3">🎓</div>
            <div className="font-semibold mb-1">Real Projects</div>
            <div className="text-sm text-gray-300">
              Build actual apps, not just theory
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div className="text-3xl mb-3">🏆</div>
            <div className="font-semibold mb-1">Track Progress</div>
            <div className="text-sm text-gray-300">
              See your growth with milestones
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
