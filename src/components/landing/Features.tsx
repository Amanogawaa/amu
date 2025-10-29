const features = [
  {
    title: 'Personalized Courses',
    desc: 'Pick a topic & level → get a full course in seconds.',
    icon: '🎯',
    gradient: 'from-blue-500/10 to-winter-teal/10',
    borderColor: 'border-winter-teal/30',
  },
  {
    title: 'Real-Time Chat Help',
    desc: 'Stuck? Ask questions and get clear, beginner-friendly answers.',
    icon: '💬',
    gradient: 'from-purple-500/10 to-evergreen-dusk/10',
    borderColor: 'border-evergreen-dusk/30',
  },
  {
    title: 'Interactive Exercises',
    desc: 'Practice with hands-on coding right in your browser.',
    icon: '💻',
    gradient: 'from-green-500/10 to-winter-teal/10',
    borderColor: 'border-winter-teal/30',
  },
  {
    title: 'Progress Tracking',
    desc: 'Smart suggestions based on how you learn and grow.',
    icon: '📈',
    gradient: 'from-orange-500/10 to-evergreen-dusk/10',
    borderColor: 'border-evergreen-dusk/30',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-winter-teal/50 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 mb-4 bg-winter-teal/10 rounded-full text-sm font-medium text-evergreen-dusk">
            Why Choose Amu
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-custom-foreground mb-4">
            Built for{' '}
            <span className="bg-gradient-to-r from-winter-teal to-evergreen-dusk bg-clip-text text-transparent">
              Beginners
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to start your coding journey, all in one place
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group relative bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon with background */}
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 text-4xl bg-gradient-to-br from-winter-teal/10 to-evergreen-dusk/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>

                <h3 className="text-xl font-bold text-custom-foreground mb-3 group-hover:text-evergreen-dusk transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center text-winter-teal opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Border accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-winter-teal to-evergreen-dusk transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              />
            </div>
          ))}
        </div>

        {/* Additional info section */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-evergreen-dusk mb-1">
                1,000+
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-evergreen-dusk mb-1">
                50+
              </div>
              <div className="text-sm text-gray-600">Course Topics</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div className="text-center">
              <div className="text-3xl font-bold text-evergreen-dusk mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
