import React from 'react';
import {
  LucideIcon,
  FileQuestion,
  BookOpen,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeneralEmptyPageProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  type?: 'course' | 'lesson' | 'chapter' | 'default';
}

const emptyStateConfig = {
  course: {
    icon: BookOpen,
    title: 'No courses found',
    description: 'Start creating your first AI-powered course to get started.',
  },
  lesson: {
    icon: GraduationCap,
    title: 'No lessons available',
    description:
      'Add lessons to this chapter to begin building your course content.',
  },
  chapter: {
    icon: Layers,
    title: 'No chapters found',
    description: 'Create chapters to organize your course content effectively.',
  },
  default: {
    icon: FileQuestion,
    title: 'No data available',
    description: 'There is no content to display at the moment.',
  },
};

const GeneralEmptyPage = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  type = 'default',
}: GeneralEmptyPageProps) => {
  const config = emptyStateConfig[type];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="rounded-full bg-muted p-6 mb-6">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>

      <h3 className="text-2xl font-semibold text-foreground mb-2">
        {displayTitle}
      </h3>

      <p className="text-muted-foreground max-w-md mb-6">
        {displayDescription}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default GeneralEmptyPage;
