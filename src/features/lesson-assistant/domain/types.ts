export interface AssistantMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    tokensUsed?: number;
    processingTime?: number;
    contextSources?: string[];
  };
}

export interface AssistantSession {
  lessonId: string;
  courseId: string;
  messages: AssistantMessage[];
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: "concept" | "example" | "practice" | "general";
}
