import apiRequest from '@/server/helpers/apiRequest';
import {
  ExecutionRequest,
  ExecutionResult,
  SaveWorkspaceRequest,
} from './types';

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
  request: PistonExecutionRequest
): Promise<PistonExecutionResponse> {
  return apiRequest<PistonExecutionRequest, PistonExecutionResponse>(
    '/piston/execute',
    'post',
    request
  );
}

export async function pistonGetSupportedLanguages() {
  return apiRequest<null, any>('/piston/languages', 'get');
}

/* 

  the code below is for future server side code playground using judge0 api
  if needed in future - if self hosted judge0 server is available or rapidapi plan is upgraded  

*/

export async function executeCode(request: ExecutionRequest): Promise<any> {
  return apiRequest<ExecutionRequest, ExecutionResult>(
    '/code/execute',
    'post',
    request
  );
}

export async function executeAndSaveCode(request: ExecutionRequest) {
  return apiRequest<ExecutionRequest, null>(
    '/code/execute-and-save',
    'post',
    request
  );
}

export async function getWorkspace(lessonId: string) {
  return apiRequest<string, any>(`/code/workspace/${lessonId}`, 'get');
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
  >('/code/workspace', 'post', data);
}

export async function getSupportedLanguages() {
  return apiRequest<null, { data: string[] }>('/code/languages', 'get');
}
