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
    status: 'success' | 'error' | 'timeout';
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
