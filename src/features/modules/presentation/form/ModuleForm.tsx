'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useGetCourse } from '@/features/course/application/useGetCourses';
import { Loader2, PackageXIcon, Sparkles } from 'lucide-react';
import useCreateModules from '../../application/useCreateModule';
import { logger } from '@/lib/loggers';

const ModuleForm = ({ courseId }: { courseId: string }) => {
  const { data: course } = useGetCourse(courseId);
  const { mutateAsync, isPending } = useCreateModules();

  const onSubmit = async () => {
    if (!course) return;

    const payload = {
      courseId: course.id,
      courseName: course.name,
      courseDescription: course.description,
      learningOutcomes: course.learning_outcomes,
      level: course.level,
      duration: course.duration,
      language: course.language,
      noOfModules: course.noOfModules,
      prerequisites: course.prequisites || '',
    };

    try {
      await mutateAsync(payload);
    } catch (err) {
      logger.error('Module generation failed', err);
    }
  };

  return (
    <CardContent className="flex flex-col justify-center items-center h-full gap-4 text-center py-20">
      <PackageXIcon className="w-10 h-10 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">No modules yet</h1>
        <p className="text-sm text-muted-foreground">
          Generate modules using AI to structure your course content.
        </p>
      </div>
      <Button onClick={() => onSubmit()} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Modules...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Modules
          </>
        )}
      </Button>
    </CardContent>
  );
};

export default ModuleForm;
