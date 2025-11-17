'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  GraduationCap,
  MessageSquare,
  UserCircle,
  Layers,
  BookMarked,
  Plus,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

type EmptyStateType =
  | 'no-courses'
  | 'no-enrolled-courses'
  | 'no-modules'
  | 'no-lessons'
  | 'no-comments'
  | 'no-enrollments'
  | 'no-search-results'
  | 'no-published-courses';

interface EmptyStateProps {
  type: EmptyStateType;
  customTitle?: string;
  customDescription?: string;
  customAction?: () => void;
  customActionLabel?: string;
}

const emptyStateConfigs: Record<
  EmptyStateType,
  {
    icon: typeof BookOpen;
    title: string;
    description: string;
    suggestions: string[];
    primaryAction?: {
      label: string;
      href?: string;
      onClick?: () => void;
    };
    secondaryAction?: {
      label: string;
      href?: string;
    };
  }
> = {
  'no-courses': {
    icon: BookOpen,
    title: 'No Courses Yet',
    description:
      "You haven't created any courses yet. Start building your first AI-powered course in minutes!",
    suggestions: [
      'Create your first course with AI assistance',
      'Choose from various topics and difficulty levels',
      'Customize content to match your teaching style',
    ],
    primaryAction: {
      label: 'Create Your First Course',
      href: '/create',
    },
    secondaryAction: {
      label: 'Explore Courses',
      href: '/explore',
    },
  },
  'no-enrolled-courses': {
    icon: BookMarked,
    title: 'No Enrolled Courses',
    description:
      "You haven't enrolled in any courses yet. Discover amazing courses tailored to your learning goals!",
    suggestions: [
      'Browse our extensive course catalog',
      'Enroll in courses that match your interests',
      'Track your learning progress',
    ],
    primaryAction: {
      label: 'Explore Courses',
      href: '/explore',
    },
  },
  'no-modules': {
    icon: Layers,
    title: 'No Modules Available',
    description:
      "This course doesn't have any modules yet. Modules help organize your course content into manageable sections.",
    suggestions: [
      'AI will generate modules automatically',
      'Each module focuses on a specific topic',
      'Modules can contain multiple lessons',
    ],
  },
  'no-lessons': {
    icon: GraduationCap,
    title: 'No Lessons Yet',
    description:
      "This module doesn't contain any lessons. Lessons are the building blocks of your course content.",
    suggestions: [
      'Lessons contain the actual learning material',
      'Each lesson covers a specific concept',
      'Includes text, examples, and quizzes',
    ],
  },
  'no-comments': {
    icon: MessageSquare,
    title: 'No Comments Yet',
    description:
      'Be the first to start a discussion! Share your thoughts, ask questions, or help others learn.',
    suggestions: [
      'Ask questions about the content',
      'Share insights and experiences',
      'Help other learners',
    ],
    primaryAction: {
      label: 'Start the Discussion',
    },
  },
  'no-enrollments': {
    icon: UserCircle,
    title: 'No Students Enrolled',
    description:
      "This course doesn't have any students yet. Share your course to attract learners!",
    suggestions: [
      'Publish your course to make it discoverable',
      'Share the course link with your network',
      'Ensure course content is complete and engaging',
    ],
  },
  'no-search-results': {
    icon: Search,
    title: 'No Results Found',
    description:
      "We couldn't find any courses matching your search. Try different keywords or browse all courses.",
    suggestions: [
      'Try using different keywords',
      'Check for spelling mistakes',
      'Use broader search terms',
    ],
    primaryAction: {
      label: 'Clear Search',
      onClick: () => window.location.reload(),
    },
    secondaryAction: {
      label: 'Browse All Courses',
      href: '/explore',
    },
  },
  'no-published-courses': {
    icon: BookOpen,
    title: 'No Published Courses',
    description:
      'There are no published courses available at the moment. Check back soon for new content!',
    suggestions: [
      'New courses are added regularly',
      'Create your own course to share knowledge',
      'Explore draft courses in your dashboard',
    ],
    primaryAction: {
      label: 'Create a Course',
      href: '/create',
    },
  },
};

export function EnhancedEmptyState({
  type,
  customTitle,
  customDescription,
  customAction,
  customActionLabel,
}: EmptyStateProps) {
  const config = emptyStateConfigs[type];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-center min-h-[500px] p-6">
      <Card className="max-w-2xl w-full border-dashed">
        <CardContent className="pt-10 pb-10">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative rounded-full bg-primary/10 p-6 ring-1 ring-primary/20">
                <Icon className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                {customTitle || config.title}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {customDescription || config.description}
              </p>
            </div>

            {/* Suggestions */}
            <div className="w-full max-w-md space-y-2">
              <p className="text-sm font-medium text-foreground/70">
                {type === 'no-search-results'
                  ? 'Try these tips:'
                  : 'What you can do:'}
              </p>
              <ul className="space-y-2">
                {config.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
              {customAction && customActionLabel ? (
                <Button
                  onClick={customAction}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {customActionLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                config.primaryAction && (
                  <>
                    {config.primaryAction.href ? (
                      <Link href={config.primaryAction.href} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          {config.primaryAction.label}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={config.primaryAction.onClick}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {config.primaryAction.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </>
                )
              )}

              {config.secondaryAction && (
                <Link
                  href={config.secondaryAction.href || '/'}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    {config.secondaryAction.label}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
