export interface AppAssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SuggestedAppQuestion {
  id: string;
  text: string;
  category: "feature" | "concept" | "glossary" | "general";
}
