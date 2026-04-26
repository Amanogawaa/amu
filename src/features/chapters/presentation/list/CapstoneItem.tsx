"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCapstoneAccess } from "@/features/capstone/application/useCapstoneAccess";
import { Lock, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CapstoneItemProps {
  courseId: string;
  courseOwnerId?: string;
}

export const CapstoneItem = ({
  courseId,
  courseOwnerId,
}: CapstoneItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isLocked, lockMessage } = useCapstoneAccess({
    courseId,
    courseOwnerId,
  });

  const handleOpenChange = (open: boolean) => {
    if (!isLocked) {
      setIsOpen(open);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <div className="rounded-md border">
        <CollapsibleTrigger
          onClick={() => {
            if (!isLocked) {
              router.push(`/courses/${courseId}/capstone`);
            }
          }}
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
        </CollapsibleTrigger>

        {isLocked && lockMessage && (
          <div className="px-4 pb-3">
            <Alert className="border-yellow-200 ">
              <Lock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-sm text-yellow-800">
                {lockMessage}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </Collapsible>
  );
};
