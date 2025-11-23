'use client';

import { useValidateCourse } from '@/features/create/application/usePublishCourse';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CourseValidationBadgeProps {
  courseId: string;
  compact?: boolean;
}

export function CourseValidationBadge({
  courseId,
  compact = false,
}: CourseValidationBadgeProps) {
  const { data: validation, isLoading } = useValidateCourse(courseId);

  if (isLoading) {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        {!compact && <span>Checking...</span>}
      </Badge>
    );
  }

  if (!validation) return null;

  const { data: validationData } = validation;

  if (validationData.isComplete) {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 gap-1">
        <CheckCircle2 className="h-3 w-3" />
        {!compact && <span>Complete</span>}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-100 gap-1 cursor-help"
          >
            <AlertCircle className="h-3 w-3" />
            {!compact && <span>Incomplete</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-semibold text-sm">Missing components:</p>
            <ul className="text-xs list-disc list-inside space-y-1">
              {validationData.missingComponents.map((component) => (
                <li key={component} className="capitalize">
                  {component}
                  {component === 'capstone project' && (
                    <span className="block mt-0.5 text-muted-foreground italic">
                      💡 Visit the Capstone section to generate
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
