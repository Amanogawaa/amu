export interface CreateChapterPayload {
  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  moduleLearningObjectives: string[];
  moduleKeySkills: string[];
  estimatedDuration: string;
  estimatedChapterCount: number;
  courseName: string;
  level: string;
  language: string;
  moduleOrder: number;
}
