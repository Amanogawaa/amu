export interface CodeWorkspace {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  code: string;
  language: string;
  lastRun?: {
    timestamp: Date;
    output: string;
    error?: string;
    executionTime: number;
    status: "success" | "error" | "timeout";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
  compile_output?: string;
}

export interface WorkspaceResponse {
  data: CodeWorkspace | CodeWorkspace[];
  message: string;
}

export interface Judge0ResultResponse {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
  compile_output: string | null;
}

// ==================== EXERCISE GUIDELINES ====================
// NEW: Replaces code execution with comprehensive guidelines

export interface ExerciseGuideline {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  objectives: string[];
  gettingStarted: {
    editorOptions: Array<{
      name: string;
      description: string;
      url: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      pros: string[];
      cons: string[];
    }>;
    environmentSetup: string[];
    recommendedApproach: string;
  };
  problemStatement: {
    description: string;
    constraints: string[];
    acceptanceCriteria: string[];
  };
  technicalRequirements: {
    languages: string[];
    frameworks?: string[];
    tools: string[];
    runtime?: string;
  };
  solutionApproach: {
    steps: string[];
    pseudocode?: string;
    keyAlgorithms?: string[];
  };
  projectStructure: {
    description: string;
    fileStructure: Record<string, string>;
  };
  testingGuidelines: {
    whatToTest: string[];
    sampleTestCases?: Array<{
      input: string;
      expectedOutput: string;
    }>;
    testingTools: string[];
    bestPractices: string[];
  };
  commonMistakes: Array<{
    mistake: string;
    correction: string;
    prevention: string;
  }>;
  bestPractices: string[];
  resources: string[];
  examples: {
    description: string;
    links: string[];
  };
  estimatedTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  submissionGuidelines: {
    format: string;
    requiredFiles: string[];
    instructions: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseGuidelineResponse {
  data: ExerciseGuideline;
  message: string;
}

export interface ExerciseGuidelinesListResponse {
  data: ExerciseGuideline[];
  message: string;
}

// export interface LanguageMap {
//   [key: string]: number;
//   javascript: number;
//   typescript: number;
//   python: number;
//   java: number;
//   cpp: number;
//   c: number;
//   csharp: number;
//   go: number;
//   rust: number;
//   php: number;
//   ruby: number;
//   swift: number;
//   kotlin: number;
//   r: number;
//   sql: number;
//   bash: number;
// }
