'use client';

import { CapstoneSubmissionForm } from '@/features/capstone/presentation';
import { useGetCapstoneGuideline } from '@/features/capstone/application/useGetCapstoneGuideline';

interface CapstoneSubmitPageProps {
  params: {
    courseId: string;
  };
}

export default function CapstoneSubmitPage({
  params,
}: CapstoneSubmitPageProps) {
  // Note: We'll get the guidelineId from the hook
  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Submit Your Capstone Project
          </h1>
          <p className="text-muted-foreground mt-2">
            Share your completed project with the community and get valuable
            feedback from peers.
          </p>
        </div>

        <CapstoneSubmissionFormWrapper courseId={params.courseId} />
      </div>
    </div>
  );
}

// Wrapper component to fetch guideline ID
function CapstoneSubmissionFormWrapper({ courseId }: { courseId: string }) {
  const { data: guideline, isLoading } = useGetCapstoneGuideline(courseId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!guideline) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No capstone guidelines found for this course.
        </p>
      </div>
    );
  }

  return (
    <CapstoneSubmissionForm courseId={courseId} guidelineId={guideline.id} />
  );
}
