import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-white via-secondary/5 to-primary/5 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold text-custom-foreground mb-6 animate-fade-in leading-tight">
          Learn to Code{' '}
          <span className="bg-gradient-to-r  from-secondary  to-primary bg-clip-text text-transparent">
            Your Way
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed">
          CourseCraft generates{' '}
          <strong className="text-primary">
            personalized programming courses
          </strong>{' '}
          for beginners — no jargon, no overwhelm. Just clear lessons,
          interactive exercises, and real-time help.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
          <Link
            href="/signup"
            className="group bg-gradient-to-r from-secondary to-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <span className="flex items-center justify-center gap-2">
              Start Learning for Free
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
          <button className="group border-2 border-primary text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              Watch Demo
            </span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Free forever for beginners</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-secondary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Start in 30 seconds</span>
          </div>
        </div>

        <div className="mt-16 animate-fade-in">
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 border border-secondary/20">
                  <div className="text-4xl mb-3">📚</div>
                  <div className="h-2 bg-secondary/20 rounded mb-2" />
                  <div className="h-2 bg-secondary/20 rounded w-3/4" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <div className="text-4xl mb-3">💻</div>
                  <div className="h-2 bg-primary/20 rounded mb-2" />
                  <div className="h-2 bg-primary/20 rounded w-2/3" />
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-primary/5 rounded-xl p-6 border border-secondary/20">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="h-2 bg-secondary/20 rounded mb-2" />
                  <div className="h-2 bg-secondary/20 rounded w-4/5" />
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
