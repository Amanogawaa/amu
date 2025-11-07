export interface Chapter {
  id: string;
  moduleId: string;
  chapterOrder: number;
  courseName: string;
  moduleName: string;
  chapterName: string;
  chapterDescription: string;
  estimatedDuration: string;
  learningObjectives: string[];
  keyTopics: string[];
  estimatedLessonCount: number;
  createdAt: Date;
  updatedAt: Date;
}
