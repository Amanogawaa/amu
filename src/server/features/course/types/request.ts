export type CreateCoursePayload = {
  topic: string;
  category: string;
  level: string;
  duration: string;
  noOfModules: number;
  language: string;
  userInstructions?: string;
};

export type DeleteCoursePayload = {
  courseId: string;
};

export type CourseFilters = {
  category?: string;
  level?: string;
  language?: string;
  limit?: number;
  offset: number;
};
