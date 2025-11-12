export interface CreateLessonPayload {
  chapterId: string;
  chapterName: string;
  chapterDescription: string;
  chapterOrder: number;
  learningObjectives: string[];
  keyTopics: string[];
  estimatedDuration: string;
  estimatedLessonCount: number;
  courseName: string;
  moduleName: string;
  level: string;
  language: string;
}
