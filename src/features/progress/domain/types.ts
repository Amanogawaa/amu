export interface ProgressDomain {
  courseId: string;
  userId: string;
  lessonsCompleted: string[];
  totalLessons: number;
  percentComplete: number;
  lastActivityAt: Date;
}

export interface ProgressSummaryDomain {
  totalCourses: number;
  coursesInProgress: number;
  coursesCompleted: number;
  totalLessonsCompleted: number;
}
