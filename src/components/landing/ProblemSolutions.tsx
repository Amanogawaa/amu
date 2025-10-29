export default function ProblemSolution() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem Section */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50" />
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
              <div className="inline-block p-3 bg-red-50 rounded-xl mb-6">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-custom-foreground mb-4">
                The Struggle is <span className="text-red-500">Real</span>
              </h3>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                <strong className="text-red-600">68% of students</strong>{' '}
                struggle to find relevant materials. Tutorials use terms like
                "loops" without explaining them. YouTube? Overwhelming. ChatGPT?
                Too advanced.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Confusing jargon
                    </h4>
                    <p className="text-sm text-gray-600">
                      Technical terms without context
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      No clear starting point
                    </h4>
                    <p className="text-sm text-gray-600">
                      Where do beginners even begin?
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mt-1">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Not tailored to your level
                    </h4>
                    <p className="text-sm text-gray-600">
                      One-size-fits-all doesn't work
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-winter-teal/20 rounded-full blur-3xl" />
            <div className="relative bg-gradient-to-br from-winter-teal/10 to-evergreen-dusk/10 p-8 rounded-3xl shadow-xl border border-winter-teal/30">
              <div className="inline-block p-3 bg-white rounded-xl mb-6 shadow-md">
                <svg
                  className="w-8 h-8 text-winter-teal"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="text-3xl font-bold text-custom-foreground mb-4">
                Amu <span className="text-winter-teal">Fixes That</span>
              </h3>

              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Type:{' '}
                <strong className="text-evergreen-dusk">
                  "Python for absolute beginners"
                </strong>
                <br />→ Get a full course with simple lessons, exercises, and a
                chat buddy.
              </p>

              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white">
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 font-mono">your-course.py</span>
                </div>

                <div className="font-mono text-sm space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-winter-teal">→</span>
                    <div>
                      <div className="text-evergreen-dusk font-semibold">
                        Lesson 1: What is a variable?
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Clear explanation in plain English
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-winter-teal">→</span>
                    <div>
                      <div className="text-evergreen-dusk font-semibold">
                        Exercise: Print your name
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Hands-on practice with instant feedback
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-winter-teal">→</span>
                    <div>
                      <div className="text-evergreen-dusk font-semibold">
                        Chat: "What does print() do?"
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        Get answers in real-time
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success indicators */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-evergreen-dusk">
                    Beginner-friendly
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-evergreen-dusk">
                    Personalized
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full text-sm">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium text-evergreen-dusk">
                    Interactive
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
