export interface ExecutionRequest {
  code: string;
  language: string;
  stdin?: string;
  lessonId: string;
}

export interface Judge0SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

export interface Judge0SubmissionResponse {
  token: string;
}

export interface SaveWorkspaceRequest {
  lessonId: string;
  courseId: string;
  code: string;
  language: string;
}
