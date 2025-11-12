import apiRequest from '@/server/helpers/apiRequest';
import {
  Quiz,
  QuizAttempt,
  GenerateQuizRequest,
  SubmitQuizRequest,
} from './types';

export interface QuizResponse {
  data: Quiz;
  message?: string;
}

export interface QuizAttemptResponse {
  data: QuizAttempt;
  message?: string;
}

export interface QuizAttemptsResponse {
  data: QuizAttempt[];
}

export async function generateQuiz(
  payload: GenerateQuizRequest
): Promise<QuizResponse> {
  return apiRequest<GenerateQuizRequest, QuizResponse>(
    '/quiz/generate',
    'post',
    payload
  );
}

export async function getQuizForLesson(
  lessonId: string
): Promise<QuizResponse> {
  return apiRequest<null, QuizResponse>(`/lessons/${lessonId}/quiz`, 'get');
}

export async function submitQuiz(
  quizId: string,
  payload: SubmitQuizRequest
): Promise<QuizAttemptResponse> {
  return apiRequest<SubmitQuizRequest, QuizAttemptResponse>(
    `/quizzes/${quizId}/submit`,
    'post',
    payload
  );
}

export async function getUserAttempts(
  quizId: string
): Promise<QuizAttemptsResponse> {
  return apiRequest<null, QuizAttemptsResponse>(
    `/quizzes/${quizId}/attempts`,
    'get'
  );
}

export async function getAttemptById(
  attemptId: string
): Promise<QuizAttemptResponse> {
  return apiRequest<null, QuizAttemptResponse>(`/attempts/${attemptId}`, 'get');
}
