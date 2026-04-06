'use client';

import { useValidateCourse } from '@/features/create/application/usePublishCourse';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
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
  const badgeBaseClass =
    'gap-1.5 rounded-full px-2.5 py-0.5 border text-[11px] font-medium';

  if (isLoading) {
    return (
      <Badge
        variant="secondary"
        className={`${badgeBaseClass} bg-muted text-muted-foreground border-border`}
      >
        <Loader2 className="h-3 w-3 animate-spin" />
        {!compact && <span>Checking</span>}
      </Badge>
    );
  }

  if (!validation) return null;

  const { data: validationData } = validation;

  if (validationData.isComplete) {
    return (
      <Badge
        className={`${badgeBaseClass} border-emerald-300/60 bg-emerald-500/10 text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-500/20 dark:text-emerald-200`}
      >
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
            className={`${badgeBaseClass} cursor-help border-amber-300/60 bg-amber-500/10 text-amber-700 dark:border-amber-700/60 dark:bg-amber-500/20 dark:text-amber-200`}
          >
            <AlertCircle className="h-3 w-3" />
            {/* {!compact && <span>Incomplete</span>} */}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-72 rounded-xl border border-border/60 bg-popover/95 p-3 shadow-xl">
          <div className="space-y-2">
            <p className="font-semibold text-sm text-foreground">
              Missing components
            </p>
            <ul className="text-xs list-disc list-inside space-y-1.5">
              {validationData.missingComponents.map((component) => (
                <li key={component} className="capitalize">
                  <span className="text-muted-foreground">
                    {component}
                  </span>

                  {component === 'capstone project' && (
                    <span className="mt-1 flex items-center gap-1 text-muted-foreground italic normal-case truncate">
                      <Sparkles className="h-3 w-3" />
                      Tip: Visit the Capstone section to generate
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
