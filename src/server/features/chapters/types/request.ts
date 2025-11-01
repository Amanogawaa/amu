export interface CreateChapterPayload {
  courseId: string;
  courseName: string;
  description: string;
  learningOutcomes: string[];
  duration: string;
  noOfChapters: string;
  level: string;
  language: string;
  prerequisites?: string;
}
