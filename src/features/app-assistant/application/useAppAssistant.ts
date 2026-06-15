import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/application/AuthContext";
import type { AppAssistantMessage, SuggestedAppQuestion } from "../domain/types";
import {
  createOrGetAppChat,
  askAppQuestion,
  getAppChatHistory,
  deleteAppChat,
} from "@/server/features/app-assistant";
import type { AppChatMessage } from "@/server/features/app-assistant/types";

const convertMessage = (msg: AppChatMessage): AppAssistantMessage => ({
  id: msg.id,
  role: msg.role,
  content: msg.content,
  timestamp: new Date(msg.createdAt),
  metadata: msg.metadata,
});

export const useAppAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AppAssistantMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queryClient = useQueryClient();

  const suggestedQuestions: SuggestedAppQuestion[] = [
    {
      id: "1",
      text: "How do I navigate through CourseCraft?",
      category: "feature",
    },
    {
      id: "2",
      text: "What is an API?",
      category: "glossary",
    },
    {
      id: "3",
      text: "Can you explain object-oriented programming?",
      category: "concept",
    },
    {
      id: "4",
      text: "How does the code playground work?",
      category: "feature",
    },
  ];

  const { data: chatData, isLoading: isInitializing } = useQuery({
    queryKey: ["app-assistant-chat"],
    queryFn: () => createOrGetAppChat(),
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["app-assistant-history", chatId],
    queryFn: () => getAppChatHistory(chatId!, { limit: 50 }),
    enabled: !!chatId,
  });

  useEffect(() => {
    if (chatData?.data?.chat?.id) {
      setChatId(chatData.data.chat.id);
    }
  }, [chatData]);

  useEffect(() => {
    if (historyData?.data?.messages) {
      setMessages(historyData.data.messages.map(convertMessage));
      setIsInitialLoad(false);
    }
  }, [historyData]);

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!chatId) throw new Error("App chat session not initialized");
      return deleteAppChat(chatId);
    },
    onSuccess: () => {
      setMessages([]);
      setChatId(null);
      queryClient.invalidateQueries({
        queryKey: ["app-assistant-chat"],
      });
    },
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatId) {
        console.error("App chat session not initialized");
        return;
      }

      const userMessage: AppAssistantMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      const assistantMessageId = `temp-assistant-${Date.now()}`;
      const placeholderMessage: AppAssistantMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        const response = await askAppQuestion(chatId, { question: content });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? convertMessage(response.data.message)
              : msg,
          ),
        );
      } catch (error) {
        console.error("Failed to send app message:", error);
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [chatId],
  );

  const clearMessages = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  return {
    messages,
    isLoading: isStreaming,
    isInitializing:
      messages.length === 0 &&
      isInitialLoad &&
      (isInitializing || isLoadingHistory),
    suggestedQuestions,
    sendMessage,
    clearMessages,
    chatId,
  };
};
