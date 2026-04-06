import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/40 to-secondary/10">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Shield className="size-12 text-primary" />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: December 1, 2025
          </p>
        </div>

        {/* Quick Overview Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card/80 p-6 text-center backdrop-blur">
            <Lock className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Secure</h3>
            <p className="text-xs text-muted-foreground">
              Your data is encrypted and protected
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/80 p-6 text-center backdrop-blur">
            <Eye className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Transparent</h3>
            <p className="text-xs text-muted-foreground">
              We&apos;re clear about what we collect
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card/80 p-6 text-center backdrop-blur">
            <Database className="mx-auto mb-3 size-8 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Your Control</h3>
            <p className="text-xs text-muted-foreground">
              You can access, edit, or delete your data
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert mx-auto max-w-none">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                1. Introduction
              </h2>
              <p className="text-muted-foreground">
                Welcome to CourseCraft&apos;s Privacy Policy. This policy
                describes how we collect, use, store, and protect your personal
                information when you use our AI-powered learning management
                system.
              </p>
              <div className="mt-4 rounded-lg bg-primary/10 p-4">
                <p className="text-sm font-semibold text-foreground">
                  We are committed to protecting your privacy and ensuring you
                  have a positive experience on our platform.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                2. Information We Collect
              </h2>

              <h3 className="mb-2 text-xl font-semibold text-foreground">
                2.1 Information You Provide to Us
              </h3>
              <div className="mb-4 space-y-3">
                <div>
                  <p className="font-semibold text-foreground">
                    Account Information:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>First and last name</li>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Student ID (optional)</li>
                    <li>Program/Course (optional)</li>
                    <li>Year level (optional)</li>
                    <li>Profile information (avatar, bio, etc.)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Educational Content:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Course enrollments</li>
                    <li>Learning progress and completion data</li>
                    <li>Quiz responses and scores</li>
                    <li>Capstone project submissions</li>
                    <li>Code written in the playground</li>
                    <li>Comments and discussions</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    GitHub Integration (Optional):
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>GitHub username</li>
                    <li>Public repository information</li>
                    <li>OAuth tokens (securely stored)</li>
                  </ul>
                </div>
              </div>

              <h3 className="mb-2 text-xl font-semibold text-foreground">
                2.2 Information Collected Automatically
              </h3>
              <div className="mb-4 space-y-3">
                <div>
                  <p className="font-semibold text-foreground">Usage Data:</p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Pages visited and features used</li>
                    <li>Time spent on lessons and courses</li>
                    <li>Course generation requests</li>
                    <li>Search queries</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Technical Information:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Device information</li>
                    <li>Operating system</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Cookies and Similar Technologies:
                  </p>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Session cookies for authentication</li>
                    <li>Preference cookies for settings</li>
                    <li>Analytics cookies for usage statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                3. How We Use Your Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    To Provide the Service:
                  </h3>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Create and manage your account</li>
                    <li>Generate personalized learning content</li>
                    <li>Track your learning progress</li>
                    <li>Enable code playground functionality</li>
                    <li>Process your course enrollments</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    To Improve the Service:
                  </h3>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Analyze usage patterns and trends</li>
                    <li>Optimize AI content generation</li>
                    <li>Improve user experience and interface</li>
                    <li>Debug and fix technical issues</li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    To Ensure Security:
                  </h3>
                  <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                    <li>Detect and prevent fraud</li>
                    <li>Protect against malicious activity</li>
                    <li>Enforce our Terms and Conditions</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                4. How We Share Your Information
              </h2>

              <div className="mb-4 rounded-lg bg-green-500/10 p-4">
                <p className="font-semibold text-foreground">
                  ✓ We Do NOT Sell Your Personal Information
                </p>
                <p className="text-sm text-muted-foreground">
                  We do not sell, rent, or trade your personal information to
                  third parties for their marketing purposes.
                </p>
              </div>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Service Providers
              </h3>
              <p className="mb-2 text-muted-foreground">
                We may share your information with trusted third-party service
                providers:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Cloud hosting and database services</li>
                <li>AI services (Google Gemini API for content generation)</li>
                <li>Analytics platforms</li>
                <li>Authentication services (Firebase, GitHub OAuth)</li>
              </ul>
              <p className="mt-2 text-sm italic text-muted-foreground">
                All service providers are contractually obligated to protect
                your data and use it only for specified purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                5. Data Storage and Security
              </h2>

              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Security Measures
              </h3>
              <p className="mb-2 text-muted-foreground">
                We implement industry-standard security measures:
              </p>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Encryption in transit (HTTPS/TLS)</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Secure password hashing</li>
                <li>Regular security audits and updates</li>
                <li>Firewall and intrusion detection systems</li>
              </ul>

              <h3 className="mb-2 mt-4 text-lg font-semibold text-foreground">
                Data Retention
              </h3>
              <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                <li>Account data: Retained while your account is active</li>
                <li>Learning progress: Retained for analytical purposes</li>
                <li>Generated courses: Retained to serve enrolled users</li>
                <li>Deleted account data: Removed within 90 days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                6. Your Rights and Choices
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Right to Access
                  </h3>
                  <p className="text-muted-foreground">
                    Request a copy of your personal data and review what
                    information we hold about you.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Right to Rectification
                  </h3>
                  <p className="text-muted-foreground">
                    Correct inaccurate personal information and update
                    incomplete data.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Right to Erasure
                  </h3>
                  <p className="text-muted-foreground">
                    Request deletion of your personal data. Account deletion
                    removes most personal information.
                  </p>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    Right to Data Portability
                  </h3>
                  <p className="text-muted-foreground">
                    Receive your data in a structured, machine-readable format.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-secondary/20 p-4">
                <p className="text-sm text-muted-foreground">
                  To exercise any of these rights, please contact us through
                  your account settings or support channels. We will respond
                  within 30 days.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                7. Children&apos;s Privacy
              </h2>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>The Service is intended for users aged 13 and older</li>
                <li>We do not knowingly collect data from children under 13</li>
                <li>Users aged 13-18 should have parental consent</li>
                <li>
                  If we discover we have collected data from a child under 13,
                  we will delete the account and associated data
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                8. AI and Automated Decision-Making
              </h2>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>We use AI to generate educational content</li>
                <li>Generation is based on user inputs and preferences</li>
                <li>
                  Content is not personalized based on sensitive categories
                </li>
                <li>
                  Your content may be used to improve AI models (personal
                  information removed)
                </li>
                <li>You can request human review of AI-generated content</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                9. Cookies and Tracking Technologies
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-foreground">
                    Essential Cookies:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Authentication, session management, security, and core
                    functionality
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Functional Cookies:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remember your preferences and improve user experience
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-foreground">
                    Analytics Cookies:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Understand usage patterns and measure performance
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm italic text-muted-foreground">
                You can configure browser settings to block or delete cookies.
                Note that blocking essential cookies may affect functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                10. Changes to This Privacy Policy
              </h2>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>We may update this Privacy Policy periodically</li>
                <li>
                  Material changes will be notified through email or in-app
                  announcements
                </li>
                <li>
                  Check the &quot;Last Updated&quot; date for recent changes
                </li>
                <li>Continued use constitutes acceptance of changes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                11. Contact Us
              </h2>
              <p className="text-muted-foreground">
                For questions about this Privacy Policy or our data practices,
                please contact us through:
              </p>
              <ul className="ml-6 mt-2 list-disc space-y-1 text-muted-foreground">
                <li>The in-app support feature</li>
                <li>Contact form on our website</li>
                <li>Email support channels</li>
              </ul>
            </section>

            <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="mb-2 text-sm font-semibold text-foreground">
                Your Consent
              </p>
              <p className="text-sm text-muted-foreground">
                By using CourseCraft, you consent to the collection and use of
                information as described in this Privacy Policy. You may
                withdraw consent at any time by adjusting your account settings
                or contacting us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
