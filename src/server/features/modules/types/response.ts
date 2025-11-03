export interface CapstoneProject {
  title: string;
  description: string;
  type:
    | 'code_project'
    | 'design_project'
    | 'writing_project'
    | 'analysis_project';
  deliverables: string[];
  technicalRequirements?: string[];
  assessmentType: 'automated' | 'self_assessment' | 'peer_review';
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface Module {
  capstoneProject?: CapstoneProject;
  id: string;
  courseId: string;
  courseName: string;
  moduleOrder: number;
  moduleName: string;
  moduleDescription: string;
  estimatedDuration: string;
  estimatedChapterCount?: number;
  learningObjectives: string[];
  keySkills?: string[];
  prerequisiteModules?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
