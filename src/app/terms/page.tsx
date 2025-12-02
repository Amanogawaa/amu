import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: December 1, 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert mx-auto max-w-none">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using this AI-powered learning management
                system (&quot;CourseCraft&quot; or &quot;the Service&quot;), you
                accept and agree to be bound by the terms and conditions of this
                agreement. If you do not agree to these terms, please do not use
                the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                2. Description of Service
              </h2>
              <p className="mb-4 text-muted-foreground">
                CourseCraft is an educational platform that provides:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>AI-generated courses and learning materials</li>
                <li>Interactive lessons and quizzes</li>
                <li>Code playground for practical exercises</li>
                <li>Capstone project management</li>
                <li>Progress tracking and analytics</li>
                <li>Community features including comments and discussions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                3. User Accounts
              </h2>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                3.1 Registration
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>
                  You must provide accurate and complete information during
                  registration (name, email, and optional student details)
                </li>
                <li>
                  You are responsible for maintaining the confidentiality of
                  your account credentials
                </li>
                <li>You must be at least 13 years old to use this Service</li>
                <li>
                  Student information (ID, program, year level) is optional but
                  helps us provide a better learning experience
                </li>
                <li>
                  You agree to notify us immediately of any unauthorized use of
                  your account
                </li>
              </ul>

              <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">
                3.2 Account Responsibilities
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>
                  You are responsible for all activities conducted through your
                  account
                </li>
                <li>You may not transfer your account to another person</li>
                <li>
                  We reserve the right to suspend or terminate accounts that
                  violate these terms
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                4. User Content and Conduct
              </h2>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                4.1 Acceptable Use
              </h3>
              <p className="mb-2 text-muted-foreground">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree NOT to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>Upload malicious code or harmful content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>
                  Interfere with or disrupt the Service&apos;s integrity or
                  performance
                </li>
                <li>
                  Use the Service for any commercial purpose without permission
                </li>
              </ul>

              <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">
                4.2 User-Generated Content
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>
                  You retain ownership of content you submit (code, comments,
                  capstone projects)
                </li>
                <li>
                  By submitting content, you grant us a license to use, display,
                  and distribute it within the Service
                </li>
                <li>You are solely responsible for the content you submit</li>
                <li>
                  We reserve the right to remove content that violates these
                  terms
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                5. AI-Generated Content
              </h2>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                5.1 Content Accuracy
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>Course materials are generated using AI technology</li>
                <li>
                  While we strive for accuracy, AI-generated content may contain
                  errors or inaccuracies
                </li>
                <li>
                  We do not guarantee the completeness or reliability of
                  AI-generated materials
                </li>
                <li>
                  Users should verify important information from authoritative
                  sources
                </li>
              </ul>

              <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">
                5.2 Educational Use
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>Content is provided for educational purposes only</li>
                <li>
                  The Service does not replace formal education or professional
                  instruction
                </li>
                <li>
                  We make no warranties about learning outcomes or certification
                  value
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                6. Intellectual Property Rights
              </h2>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                6.1 Service Content
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>
                  The Service, including its design, features, and
                  functionality, is owned by us
                </li>
                <li>
                  Our trademarks, logos, and service marks are our property
                </li>
                <li>
                  You may not use our intellectual property without prior
                  written consent
                </li>
              </ul>

              <h3 className="mb-2 mt-4 text-xl font-semibold text-foreground">
                6.2 License to Use
              </h3>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>
                  We grant you a limited, non-exclusive, non-transferable
                  license to access and use the Service
                </li>
                <li>
                  This license does not include any resale or commercial use of
                  the Service
                </li>
                <li>This license is revocable at our discretion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                7. Disclaimers and Limitations of Liability
              </h2>
              <div className="rounded-lg bg-secondary/20 p-4">
                <p className="mb-2 font-semibold text-foreground">
                  Disclaimer of Warranties
                </p>
                <p className="text-sm text-muted-foreground">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                  AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                  OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                  NON-INFRINGEMENT.
                </p>
              </div>

              <div className="mt-4 rounded-lg bg-secondary/20 p-4">
                <p className="mb-2 font-semibold text-foreground">
                  Limitation of Liability
                </p>
                <p className="text-sm text-muted-foreground">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                  PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER
                  INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE,
                  GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                8. Changes to Terms
              </h2>
              <ul className="ml-6 list-disc space-y-2 text-muted-foreground">
                <li>We reserve the right to modify these Terms at any time</li>
                <li>
                  Material changes will be notified through the Service or via
                  email
                </li>
                <li>
                  Continued use of the Service after changes constitutes
                  acceptance of new Terms
                </li>
                <li>
                  You are responsible for reviewing these Terms periodically
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                9. Contact Information
              </h2>
              <p className="text-muted-foreground">
                For questions about these Terms and Conditions, please contact
                us through the contact form on our website or via our support
                channels.
              </p>
            </section>

            <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
              <p className="text-sm font-semibold text-foreground">
                By using CourseCraft, you acknowledge that you have read,
                understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
