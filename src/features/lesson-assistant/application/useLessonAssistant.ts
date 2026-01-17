import { useState, useCallback } from "react";
import type { AssistantMessage, SuggestedQuestion } from "../domain/types";

export const useLessonAssistant = (lessonId: string, courseId: string) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      id: "1",
      text: "Can you explain this concept in simpler terms?",
      category: "concept",
    },
    {
      id: "2",
      text: "Can you provide a practical example?",
      category: "example",
    },
    {
      id: "3",
      text: "How does this relate to previous lessons?",
      category: "concept",
    },
    {
      id: "4",
      text: "What are common mistakes to avoid?",
      category: "practice",
    },
  ];

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: AssistantMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // TODO: Integrate with actual API
      // Simulate AI response for UI demo
      setTimeout(() => {
        const assistantMessage: AssistantMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm here to help! This is a placeholder response. The AI assistant will be integrated soon to provide personalized help based on the lesson content.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    },
    [lessonId, courseId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    suggestedQuestions,
    sendMessage,
    clearMessages,
  };
};
