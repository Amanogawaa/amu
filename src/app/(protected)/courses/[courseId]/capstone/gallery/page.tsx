'use client';

import { CapstoneGallery } from '@/features/capstone/presentation';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CourseCapstoneGalleryPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const { data: course } = useGetCourse(courseId);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
      <div className="container mx-auto max-w-7xl">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link
            href={`/courses/${courseId}`}
            className="hover:text-foreground transition-colors font-medium"
          >
            {course?.name || 'Course'}
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-medium text-foreground">Student Projects</span>
        </nav>

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Student Capstone Projects
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explore capstone projects submitted by students for{' '}
            <span className="font-medium">{course?.name || 'this course'}</span>
          </p>
        </div>

        <CapstoneGallery courseId={courseId} limit={12} />
      </div>
    </section>
  );
}
