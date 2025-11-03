export interface CreateModulePayload {
  courseId: string;
  courseName: string;
  courseDescription: string;
  learningOutcomes: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  language: string;
  noOfModules?: number;
  prerequisites?: string;
}
