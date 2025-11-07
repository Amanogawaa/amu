'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import CourseGrid from '@/features/course/presentation/grid/CourseGrid';
import { BookOpenIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

const CoursesPage = () => {
  const { user } = useAuth();

  if (!user) {
    throw redirect('/');
  }

  return (
    <section className="flex flex-col min-h-screen w-full pb-10">
      <div className="container mx-auto max-w-5xl ">
        {/* <div className="flex items-center text-sm text-muted-foreground mb-6 uppercase tracking-wider">
          <Link
            href="/courses"
            className="hover:text-foreground transi1tion-colors"
          >
            COURSE
          </Link>
        </div> */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mt-10">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <BookOpenIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
                  MY COURSES
                </h1>
                <p className="text-muted-foreground text-lg">
                  List of courses you are enrolled in
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <SocketTestPanel /> */}
        <CourseGrid />
      </div>
    </section>
  );
};

export default CoursesPage;
