export type ProgressUpdatePayload = {
  courseId: string;
  lessonId: string;
  completed: boolean;
  totalLessons?: number;
};

export type ProgressFilters = {
  isPublished?: boolean;
  status?: string;
  minProgress?: number;
};
