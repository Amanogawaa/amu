export interface CreateChapterPayload {
  courseId: string;
  courseName: string;
  level: string;
  noOfChapters: number;
  duration: string;
  language: string;
  description: string;
  learningOutcomes: string[];
  skillsGained: string[];
  prerequisites: string;
  userInstructions?: string;
}
