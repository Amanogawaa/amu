'use client';

import { CapstoneGuidelineCard } from '@/features/capstone/presentation';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { ChevronRight, Users, Upload } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import React from 'react';

interface CapstonePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

const CapstonePage = ({ params }: CapstonePageProps) => {
  const { courseId } = React.use(params);
  const { data: course } = useGetCourse(courseId);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
      <div className="container mx-auto max-w-5xl">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className=" font-medium truncate text-foreground">
            {course?.name}
          </span>
        </nav>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Capstone Project</h1>
              <p className="text-sm text-muted-foreground mt-1">
                View guidelines and see what other students have built
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href={`/my-learning/${courseId}/capstone/submit`}>
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Your Project
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/my-learning/${courseId}/capstone/gallery`}>
                  <Users className="mr-2 h-4 w-4" />
                  View Gallery
                </Link>
              </Button>
            </div>
          </div>
          <CapstoneGuidelineCard courseId={courseId} />
        </div>
      </div>
    </section>
  );
};

export default CapstonePage;
