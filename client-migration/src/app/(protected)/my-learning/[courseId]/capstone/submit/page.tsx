'use client';

import { CapstoneSubmissionForm } from '@/features/capstone/presentation';
import { useGetCapstoneGuideline } from '@/features/capstone/application/useGetCapstoneGuideline';
import React from 'react';

interface CapstoneSubmitPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CapstoneSubmitPage({
  params,
}: CapstoneSubmitPageProps) {
  const { courseId } = React.use(params);

  return (
    <div className="container max-w-4xl mx-auto py-8">
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

        <CapstoneSubmissionFormWrapper courseId={courseId} />
      </div>
    </div>
  );
}

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
