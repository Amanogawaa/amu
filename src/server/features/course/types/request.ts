export type CreateCoursePayload = {
  topic: string;
  category: string;
  level: string;
  duration: string;
  noOfModules: number;
  language: string;
  userInstructions?: string;
};

export type DeleteCoursePayload = {
  courseId: string;
};

export type CourseFilters = {
  category?: string;
  level?: string;
  language?: string;
  limit?: number;
  offset: number;
};

/**
 * Generation Status Types
 */
export enum GenerationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Generation Step Types
 */
export enum GenerationStep {
  COURSE = 'course',
  MODULES = 'modules',
  CHAPTERS = 'chapters',
  LESSONS = 'lessons',
}

/**
 * Progress data received from Socket.IO
 */
export interface GenerationProgress {
  jobId: string;
  userId: string;
  status: GenerationStatus;
  currentStep: GenerationStep;
  progress: number; // 0-100
  message: string;
  data?: {
    courseId?: string;
    courseName?: string;
    moduleId?: string;
    moduleName?: string;
    modulesCount?: number;
    chaptersCount?: number;
    lessonsCount?: number;
  };
  error?: string;
  timestamp: string;
}

export interface FullCourseGenerationResult {
  courseId: string;
  modulesCount: number;
  chaptersCount: number;
  lessonsCount: number;
  totalDuration: string;
}

export interface FullGenerationRequest {
  category: string;
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  noOfModules: number;
  language: string;
  userInstructions?: string;
}

export interface FullGenerationResponse {
  message: string;
  note: string;
}
