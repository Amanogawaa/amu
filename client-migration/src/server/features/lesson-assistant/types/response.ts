export interface LessonChat {
  id: string;
  lessonId: string;
  userId: string;
  courseId: string;
  chapterId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  lessonId: string;
  userId: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    contextSources?: string[];
  };
  createdAt: Date;
}

export interface ChatResponse {
  data: {
    chat: LessonChat;
    message?: ChatMessage;
  };
  message: string;
}

export interface ChatHistoryResponse {
  data: {
    chat: LessonChat;
    messages: ChatMessage[];
    total: number;
  };
  message: string;
}

export interface AskQuestionResponse {
  data: {
    message: ChatMessage;
  };
  message: string;
}

export interface DeleteChatResponse {
  message: string;
}
