"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicProfile } from "@/features/user/application/useUser";
import { User2Icon, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CourseCreatorCardProps {
  creatorId: string;
}

export function CourseCreatorCard({ creatorId }: CourseCreatorCardProps) {
  const { data: creator, isLoading } = usePublicProfile(creatorId);

  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden")}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creator) {
    return null;
  }

  const displayName =
    creator.firstName || creator.lastName
      ? `${creator.firstName || ""} ${creator.lastName || ""}`.trim()
      : "Anonymous Creator";

  const initials =
    creator.firstName?.[0] ||
    creator.lastName?.[0] ||
    creator.email?.[0] ||
    "U";

  return (
    <Link href={`/profile/${creatorId}`}>
      <Card className="shadow-none cursor-pointer mb-3">
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 flex-shrink-0 border">
              <AvatarImage src={creator.photoURL} alt={displayName} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-0.5">
                Instructor
              </p>
              <p className="font-semibold text-foreground truncate hover:text-primary transition-colors">
                {displayName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
