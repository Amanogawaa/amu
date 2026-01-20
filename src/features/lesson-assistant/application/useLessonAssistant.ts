import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/application/AuthContext";
import type { AssistantMessage, SuggestedQuestion } from "../domain/types";
import {
  createOrGetChat,
  askQuestionStream,
  getChatHistory,
  deleteChat,
} from "@/server/features/lesson-assistant";
import type { ChatMessage } from "@/server/features/lesson-assistant/types";

const convertMessage = (msg: ChatMessage): AssistantMessage => ({
  id: msg.id,
  role: msg.role,
  content: msg.content,
  timestamp: new Date(msg.createdAt),
  metadata: msg.metadata,
});

export const useLessonAssistant = (lessonId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const streamingBufferRef = useRef<string>("");
  const streamingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

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

  const { data: chatData, isLoading: isInitializing } = useQuery({
    queryKey: ["lesson-assistant-chat", lessonId],
    queryFn: () => createOrGetChat({ lessonId }),
    enabled: !!lessonId,
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["lesson-assistant-history", chatId],
    queryFn: () => getChatHistory(chatId!, { limit: 50 }),
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
      if (!chatId) throw new Error("Chat session not initialized");
      return deleteChat(chatId);
    },
    onSuccess: () => {
      setMessages([]);
      setChatId(null);
      queryClient.invalidateQueries({
        queryKey: ["lesson-assistant-chat", lessonId],
      });
    },
  });

  const sendMessage = useCallback(
    async (content: string) => {
      if (!chatId) {
        console.error("Chat session not initialized");
        return;
      }

      const userMessage: AssistantMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      const assistantMessageId = `temp-assistant-${Date.now()}`;
      const placeholderMessage: AssistantMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, placeholderMessage]);

      try {
        let currentAssistantId = assistantMessageId;

        await askQuestionStream(
          chatId,
          { question: content },
          user,
          (chunk: string) => {
            streamingBufferRef.current += chunk;

            if (streamingTimerRef.current) {
              clearTimeout(streamingTimerRef.current);
            }

            streamingTimerRef.current = setTimeout(() => {
              const bufferedContent = streamingBufferRef.current;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === currentAssistantId
                    ? { ...msg, content: bufferedContent }
                    : msg,
                ),
              );
            }, 50);
          },
          (finalMessage: ChatMessage) => {
            if (streamingTimerRef.current) {
              clearTimeout(streamingTimerRef.current);
            }
            streamingBufferRef.current = "";

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentAssistantId
                  ? convertMessage(finalMessage)
                  : msg,
              ),
            );
            setIsStreaming(false);
          },
          (error: Error) => {
            console.error("Streaming error:", error);
            if (streamingTimerRef.current) {
              clearTimeout(streamingTimerRef.current);
            }
            streamingBufferRef.current = "";
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== currentAssistantId),
            );
            setIsStreaming(false);
          },
        );
      } catch (error) {
        console.error("Failed to send message:", error);
        if (streamingTimerRef.current) {
          clearTimeout(streamingTimerRef.current);
        }
        streamingBufferRef.current = "";
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId),
        );
        setIsStreaming(false);
      }
    },
    [chatId, user],
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
