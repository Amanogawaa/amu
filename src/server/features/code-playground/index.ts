import apiRequest from "@/server/helpers/apiRequest";
import {
  ExecutionRequest,
  ExecutionResult,
  SaveWorkspaceRequest,
  ExerciseGuideline,
} from "./types";

/* 

 code execution using piston api. its going to be client side only, no need for server code playground for now. but keeping the structure for future use.

*/

interface PistonExecutionRequest {
  language: string;
  sourceCode: string;
  version: string;
}

interface PistonExecutionResponse {
  language: string;
  version: string;
  run: PistonRunResult;
}

interface PistonRunResult {
  stdout: string;
  stderr: string;
  code: number;
  signal: string | null;
  output: string;
}

export async function pistonExecuteCode(
  request: PistonExecutionRequest,
): Promise<PistonExecutionResponse> {
  return apiRequest<PistonExecutionRequest, PistonExecutionResponse>(
    "/piston/execute",
    "post",
    request,
  );
}

export async function pistonGetSupportedLanguages() {
  return apiRequest<null, any>("/piston/languages", "get");
}

/* 

  the code below is for future server side code playground using judge0 api
  if needed in future - if self hosted judge0 server is available or rapidapi plan is upgraded  

*/

export async function executeCode(request: ExecutionRequest): Promise<any> {
  return apiRequest<ExecutionRequest, ExecutionResult>(
    "/code/execute",
    "post",
    request,
  );
}

export async function executeAndSaveCode(request: ExecutionRequest) {
  return apiRequest<ExecutionRequest, null>(
    "/code/execute-and-save",
    "post",
    request,
  );
}

export async function getWorkspace(lessonId: string) {
  return apiRequest<string, any>(`/code/workspace/${lessonId}`, "get");
}

export async function saveWorkspace(data: {
  lessonId: string;
  courseId: string;
  code: string;
  language: string;
}) {
  return apiRequest<
    {
      lessonId: string;
      courseId: string;
      code: string;
      language: string;
    },
    null
  >("/code/workspace", "post", data);
}

export async function getSupportedLanguages() {
  return apiRequest<null, { data: string[] }>("/code/languages", "get");
}

// ==================== EXERCISE GUIDELINES ====================
// NEW: Replaces code execution with comprehensive guidelines
// Users will use their own editors instead of the built-in playground

export async function generateExerciseGuideline(
  lessonId: string,
): Promise<ExerciseGuideline> {
  const data = await apiRequest<null, any>(
    `/guidelines/generate/${lessonId}`,
    "post",
  );
  return normalizeExerciseGuideline(data);
}

export async function getExerciseGuidelineByLessonId(
  lessonId: string,
): Promise<ExerciseGuideline | null> {
  try {
    const data = await apiRequest<null, any>(
      `/guidelines/lesson/${lessonId}`,
      "get",
    );
    return normalizeExerciseGuideline(data);
  } catch (error) {
    return null;
  }
}

export async function getExerciseGuidelineById(
  id: string,
): Promise<ExerciseGuideline> {
  const data = await apiRequest<null, any>(`/guidelines/${id}`, "get");
  return normalizeExerciseGuideline(data);
}

export async function getExerciseGuidelinesByCourseId(
  courseId: string,
): Promise<ExerciseGuideline[]> {
  const data = await apiRequest<null, any>(
    `/guidelines/course/${courseId}`,
    "get",
  );

  if (Array.isArray(data)) {
    return data.map(normalizeExerciseGuideline);
  }

  if (data.data && Array.isArray(data.data)) {
    return data.data.map(normalizeExerciseGuideline);
  }

  return [];
}

/**
 * Normalize exercise guideline data from API response
 * Ensures dates are properly typed
 */
function normalizeExerciseGuideline(data: any): ExerciseGuideline {
  return {
    ...data,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : data.createdAt?.toISOString?.() || new Date().toISOString(),
    updatedAt:
      typeof data.updatedAt === "string"
        ? data.updatedAt
        : data.updatedAt?.toISOString?.() || new Date().toISOString(),
  } as ExerciseGuideline;
}
