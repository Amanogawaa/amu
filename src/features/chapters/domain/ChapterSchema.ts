import z from 'zod';

export const handleCreateChapter = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  courseName: z.string().min(1, 'Course name is required'),
  description: z.string().min(1, 'Description is required'),
  learningOutcomes: z
    .array(z.string().min(1, 'Learning outcome cannot be empty'))
    .min(1, 'At least one learning outcome is required'),
  duration: z.string().min(1, 'Duration is required'),
  noOfChapters: z.string().min(1, 'Number of chapters is required'),
  level: z.string().min(1, 'Level is required'),
  language: z.string().min(1, 'Language is required'),
  prerequisites: z.string().optional(),
});

export type ChapterFormValues = z.infer<typeof handleCreateChapter>;
