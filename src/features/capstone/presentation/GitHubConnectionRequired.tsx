'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Github, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function GitHubConnectionRequired() {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>GitHub Account Required</AlertTitle>
        <AlertDescription>
          To submit your capstone project, you need to connect your GitHub
          account. This allows us to verify your project repository and display
          your work to the community.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Connect Your GitHub Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connecting your GitHub account enables you to:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  Submit your capstone projects directly from your repositories
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Showcase your coding portfolio to the community</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  Get automatic updates when you push changes to your project
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>Build credibility with verified project submissions</span>
              </li>
            </ul>
          </div>

          <Button asChild size="lg" className="w-full">
            <Link href="/account?tab=connections">
              <Github className="mr-2 h-4 w-4" />
              Connect GitHub Account
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* GitHub Tutorial for New Users */}
      <Card>
        <CardHeader>
          <CardTitle>Don't Have a GitHub Account?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            GitHub is the world's leading platform for hosting and collaborating
            on code projects. It's completely free for students and developers!
          </p>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-github">
              <AccordionTrigger>What is GitHub?</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  GitHub is a cloud-based platform where developers store,
                  manage, and share their code. Think of it as a social network
                  for programmers where you can:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-4">
                  <li>Store your code projects online (repositories)</li>
                  <li>Track changes to your code over time</li>
                  <li>Collaborate with other developers</li>
                  <li>Showcase your work to potential employers</li>
                  <li>Contribute to open-source projects</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="create-account">
              <AccordionTrigger>
                How to Create a GitHub Account (Step-by-Step)
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 1:</span>
                    <span className="text-muted-foreground">
                      Visit{' '}
                      <a
                        href="https://github.com/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        github.com/signup
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 2:</span>
                    <span className="text-muted-foreground">
                      Enter your email address (use the same email you use for
                      this platform for consistency)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 3:</span>
                    <span className="text-muted-foreground">
                      Create a strong password (GitHub requires at least 15
                      characters or 8 characters with a number and lowercase
                      letter)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 4:</span>
                    <span className="text-muted-foreground">
                      Choose a unique username (this will be visible to
                      everyone, e.g., @yourname)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 5:</span>
                    <span className="text-muted-foreground">
                      Verify you're not a robot by solving the puzzle
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 6:</span>
                    <span className="text-muted-foreground">
                      Click "Create account" and verify your email address
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 7:</span>
                    <span className="text-muted-foreground">
                      Personalize your experience (you can skip this or answer
                      the questions)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">Step 8:</span>
                    <span className="text-muted-foreground">
                      Choose the free plan (it's perfect for students and
                      personal projects!)
                    </span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="after-signup">
              <AccordionTrigger>What to Do After Signing Up</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">1.</span>
                    <span>
                      <strong>Complete your profile:</strong> Add a profile
                      picture, bio, and location to make your profile more
                      professional
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">2.</span>
                    <span>
                      <strong>Enable two-factor authentication (2FA):</strong>{' '}
                      Protect your account from unauthorized access (Settings →
                      Password and authentication)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">3.</span>
                    <span>
                      <strong>Create your first repository:</strong> Click the
                      "+" icon in the top right and select "New repository"
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold shrink-0">4.</span>
                    <span>
                      <strong>Come back here and connect:</strong> Return to
                      this page and click "Connect GitHub Account" above
                    </span>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tips">
              <AccordionTrigger>Pro Tips for GitHub Success</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Write good README files:</strong> Every project
                      should have a README explaining what it does and how to
                      use it
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Commit regularly:</strong> Make small, frequent
                      commits with clear messages describing what changed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Keep projects public:</strong> Public repositories
                      help build your portfolio and are free forever
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Star interesting projects:</strong> Build a
                      collection of projects you find useful or inspiring
                    </span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="pt-4">
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://github.com/signup"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Create GitHub Account
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
