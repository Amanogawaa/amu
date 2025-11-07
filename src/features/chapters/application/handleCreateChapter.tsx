import { CreateChapterPayload } from '@/server/features/chapters/types';
import { ChapterFormValues } from '../domain/ChapterSchema';

export default function handleCreateChapter(
  values: ChapterFormValues,
  onSubmit: (payload: CreateChapterPayload) => void
) {
  const payload: CreateChapterPayload = {
    moduleId: values.moduleId,
    moduleName: values.moduleName,
    moduleDescription: values.moduleDescription,
    moduleLearningObjectives: values.moduleLearningObjectives,
    moduleKeySkills: values.moduleKeySkills,
    estimatedDuration: values.estimatedDuration,
    estimatedChapterCount: values.estimatedChapterCount,
    courseName: values.courseName,
    level: values.level,
    language: values.language,
    moduleOrder: values.moduleOrder,
  };

  onSubmit(payload);
}
