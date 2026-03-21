"use client";

import { Lock, Target, ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CapstoneGuidelineCard } from "@/features/capstone/presentation/card/CapstoneGuidelineCard";
import { useState, useMemo } from "react";

interface CapstoneItemProps {
  courseId: string;
  progress: any;
  totalLessons: number;
  completedLessons: number;
  isEnrolled: boolean;
}

export const CapstoneItem = ({
  courseId,
  progress,
  totalLessons,
  completedLessons,
  isEnrolled,
}: CapstoneItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Calculate if locked with proper validation
  const isLocked = useMemo(() => {
    // If not enrolled, always locked
    if (!isEnrolled) return true;

    // If no lessons, can't unlock
    if (!totalLessons || totalLessons === 0) return true;

    // Locked if not all lessons are completed
    return completedLessons < totalLessons;
  }, [isEnrolled, totalLessons, completedLessons]);

  const handleOpenChange = (open: boolean) => {
    // Only allow opening if not locked
    if (!isLocked) {
      setIsOpen(open);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <div className="rounded-md border bg-white">
        <CollapsibleTrigger
          className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
            isLocked
              ? "cursor-not-allowed opacity-60 hover:bg-red-50/50"
              : "hover:bg-muted/10 cursor-pointer"
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Final Project
              </p>
              {isLocked && <Lock className="h-4 w-4 text-red-500" />}
            </div>
            <p className="font-semibold text-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Capstone Project Guidelines
            </p>
          </div>
          {!isLocked && (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-4" />
          )}
        </CollapsibleTrigger>

        {isLocked ? (
          <div className="px-4 pb-3">
            <Alert className="border-yellow-200 bg-yellow-50">
              <Lock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                {!isEnrolled
                  ? "Enroll in this course to unlock the capstone project."
                  : `Complete all ${totalLessons} lesson${
                      totalLessons !== 1 ? "s" : ""
                    } to unlock this capstone project. Progress: ${completedLessons}/${totalLessons}`}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <CollapsibleContent className="px-2 pb-2">
            <div className="p-4">
              <CapstoneGuidelineCard courseId={courseId} />
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};
