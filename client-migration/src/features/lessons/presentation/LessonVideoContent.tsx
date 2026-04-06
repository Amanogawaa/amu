"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

const VideoSelector = dynamic(
  () =>
    import("@/components/video/VideoSelector").then((mod) => ({
      default: mod.VideoSelector,
    })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ),
    ssr: false,
  }
);

const TranscriptViewer = dynamic(
  () =>
    import("@/components/video/TranscriptViewer").then((mod) => ({
      default: mod.TranscriptViewer,
    })),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-lg" />,
    ssr: false,
  }
);

interface LessonVideoContentProps {
  lessonId: string;
  videoSearchQuery?: string;
  selectedVideoId?: string;
}

export const LessonVideoContent = ({
  lessonId,
  videoSearchQuery,
  selectedVideoId,
}: LessonVideoContentProps) => {
  if (!videoSearchQuery) return null;

  return (
    <Card className="bg-blue-500/5 border-blue-500/20">
      <CardContent className="pt-6">
        <VideoSelector
          searchQuery={videoSearchQuery}
          lessonId={lessonId}
          selectedVideoId={selectedVideoId}
        />

        <TranscriptViewer lessonId={lessonId} videoId={selectedVideoId} />
      </CardContent>
    </Card>
  );
};
