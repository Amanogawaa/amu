export type UserProgress = {
  id: string;
  courseId: string;
  userId: string;
  lessonsCompleted: string[];
  totalLessons: number;
  percentComplete: number;
  lastActivityAt: Date;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ProgressSummary = {
  totalCourses: number;
  coursesInProgress: number;
  coursesCompleted: number;
  totalLessonsCompleted: number;
  progressByCourseName: Array<{
    courseId: string;
    courseName: string;
    percentComplete: number;
    lessonsCompleted: number;
    totalLessons: number;
  }>;
};

export type ProgressResponse = {
  data: UserProgress;
  message: string;
};

export type ProgressListResponse = {
  data: UserProgress[];
  message: string;
  total: number;
};

export type ProgressSummaryResponse = {
  data: ProgressSummary;
  message: string;
};

export type CourseStatistics = {
  totalEnrolled: number;
  averageCompletion: number;
  completedCount: number;
};

export type CourseStatisticsResponse = {
  data: CourseStatistics;
  message: string;
};
