export interface LessonAssistantPayload {
  lessonId: string;
}

export interface AskQuestionRequest {
  question: string;
}

export interface ChatHistoryRequest {
  limit?: number;
  offset?: number;
}
