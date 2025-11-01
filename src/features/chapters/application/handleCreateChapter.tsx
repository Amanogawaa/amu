import { CreateChapterPayload } from '@/server/features/chapters/types';
import { ChapterFormValues } from '../domain/ChapterSchema';

export default function handleCreateChapter(
  values: ChapterFormValues,
  onSubmit: (payload: CreateChapterPayload) => void
) {
  const payload: CreateChapterPayload = {
    courseId: values.courseId,
    courseName: values.courseName,
    description: values.description,
    learningOutcomes: values.learningOutcomes,
    duration: values.duration,
    noOfChapters: values.noOfChapters,
    level: values.level,
    language: values.language,
    prerequisites: values.prerequisites,
  };

  onSubmit(payload);
}
