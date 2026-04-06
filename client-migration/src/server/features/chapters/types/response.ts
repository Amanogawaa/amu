export interface Chapter {
  id: string;
  courseId: string;
  chapterOrder: number;
  courseName: string;
  chapterName: string;
  chapterDescription: string;
  estimatedDuration: string;
  learningObjectives: string[];
  keyTopics: string[];
  estimatedLessonCount: number;
  createdAt: Date;
  updatedAt: Date;
}
