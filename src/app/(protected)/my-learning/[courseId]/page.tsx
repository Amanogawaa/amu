'use client';

import { useGetCourse } from '@/features/course/application/useGetCourses';
import MyLearningCourseDetailPage from '@/features/my-learning/presentation/components/MyLearningCourseDetailPage';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const MyLearningCoursePage = () => {
  const params = useParams();
  const courseId = params.courseId as string;
  const { data } = useGetCourse(courseId);

  return (
    <section className="flex flex-col min-h-screen w-full pb-10 pt-6">
      <div className="container mx-auto max-w-5xl">
        <nav className="flex items-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          <Link
            href="/my-learning"
            className="hover:text-foreground transition-colors font-medium"
          >
            Courses
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className=" font-medium truncate text-foreground">
            {data?.name}
          </span>
        </nav>

        <MyLearningCourseDetailPage courseId={courseId} />
      </div>
    </section>
  );
};

export default MyLearningCoursePage;
