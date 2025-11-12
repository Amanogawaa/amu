export type ProgressUpdatePayload = {
  courseId: string;
  lessonId: string;
  completed: boolean;
  totalLessons?: number;
};
