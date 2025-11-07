export type Course = {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topic: string;
  prequisites: string;
  language: string;
  learning_outcomes: string[];
  duration: string;
  noOfChapters: number;
  banner_url: string;
  include_certificate: boolean;
  publish: boolean;
  subtitle: string;
  created_at: Date;
  updated_at: Date;
};

export type ListCoursesResponse = {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: Course[];
};

export type CourseValidationResponse = {
  isComplete: boolean;
  missingComponents: string[];
  details: {
    hasModules: boolean;
    modulesCount: number;
    hasChapters: boolean;
    chaptersCount: number;
    hasLessons: boolean;
    lessonsCount: number;
  };
};
