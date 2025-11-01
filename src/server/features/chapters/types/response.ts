export interface Chapter {
  id: string;
  courseId: string;
  courseName: string;
  chapterOrder: number;
  title: string;
  description: string;
  estimatedDuration: string;
  learningObjectives: string[];
  keyTopics: string[];
  estimatedLessonCount: number;
  createdAt: Date;
  updatedAt: Date;
}
