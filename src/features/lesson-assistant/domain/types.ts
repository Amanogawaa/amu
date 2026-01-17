export interface AssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
