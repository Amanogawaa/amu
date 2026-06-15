
export interface AppChat {
  id: string;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastMessageAt: string | Date;
}

export interface AppChatMessage {
  id: string;
  chatId: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string | Date;
}

export interface CreateAppChatResponse {
  data: {
    chat: AppChat;
  };
  message: string;
}

export interface GetAppChatHistoryResponse {
  data: {
    chat: AppChat;
    messages: AppChatMessage[];
    total: number;
  };
  message: string;
}

export interface AskAppQuestionData {
  question: string;
}

export interface AskAppQuestionResponse {
  data: {
    message: AppChatMessage;
  };
  message: string;
}
