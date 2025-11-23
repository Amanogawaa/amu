'use client';

import { Button } from '@/components/ui/button';
import { CapstoneGuidelineCard } from '@/features/capstone/presentation';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const CapstonePage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const goBack = useRouter();

  const { data: course } = useGetCourse(courseId);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
      <div className="container mx-auto max-w-5xl">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Button
            onClick={() => {
              goBack.back();
            }}
            className="hover:text-foreground font-medium bg-transparent p-0 text-secondary uppercase hover:bg-transparent active:bg-transparent focus:bg-transparent"
          >
            Courses
          </Button>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className=" font-medium truncate text-foreground">
            {course?.name}
          </span>
        </nav>

        <CapstoneGuidelineCard courseId={courseId} />
      </div>
    </section>
  );
};

export default CapstonePage;
