'use client';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { useGetModule } from '@/features/modules/application/useGetModules';
import { Loader2, PackageXIcon, Sparkles } from 'lucide-react';
import useCreateChapter from '../../application/useCreateChapter';
import { logger } from '@/lib/loggers';

const ChapterForm = ({ moduleId }: { moduleId: string }) => {
  const { mutateAsync, isPending } = useCreateChapter();
  const { data: module } = useGetModule(moduleId);

  const onSubmit = async () => {
    if (!module) return;

    const payload = {
      moduleId: module.id,
      moduleName: module.moduleName,
      moduleDescription: module.moduleDescription,
      moduleLearningObjectives: module.learningObjectives ?? [],
      moduleKeySkills: module.keySkills ?? [],
      estimatedDuration: module.estimatedDuration,
      estimatedChapterCount: module.estimatedChapterCount ?? 0,
      courseName: module.courseName,
      level: module.level,
      language: module.language,
      moduleOrder: module.moduleOrder,
    };

    try {
      await mutateAsync(payload);
    } catch (err) {
      logger.error('Module generation failed', err);
      throw err;
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

export default ChapterForm;
