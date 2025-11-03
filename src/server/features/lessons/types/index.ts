export interface LessonResource {
  title: string;
  url: string;
  type: 'documentation' | 'article' | 'tool' | 'github' | 'reference';
  description: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  lessonOrder: number;
  lessonName: string;
  type: 'video' | 'article' | 'quiz';
  duration: string;
  lessonDescription: string;
  content: string | null;
  videoSearchQuery: string | null;
  resources: LessonResource[];
  learningOutcome: string;
  prerequisites: string[];
  createdAt?: string;
  updatedAt?: string;
}

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
