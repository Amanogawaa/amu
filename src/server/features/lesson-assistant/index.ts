import apiRequest from "@/server/helpers/apiRequest";
import Cookies from "js-cookie";
import type { User } from "firebase/auth";
import type {
  AskQuestionRequest,
  AskQuestionResponse,
  ChatHistoryRequest,
  ChatHistoryResponse,
  ChatMessage,
  ChatResponse,
  DeleteChatResponse,
  LessonAssistantPayload,
} from "./types";

export async function createOrGetChat(payload: LessonAssistantPayload) {
  return apiRequest<LessonAssistantPayload, ChatResponse>(
    `/lessons/${payload.lessonId}/chat`,
    "post",
    payload,
  );
}

export async function askQuestion(chatId: string, payload: AskQuestionRequest) {
  return apiRequest<AskQuestionRequest, AskQuestionResponse>(
    `/chat/${chatId}/ask`,
    "post",
    payload,
  );
}

export async function getChatHistory(
  chatId: string,
  params?: ChatHistoryRequest,
) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set("limit", params.limit.toString());
  if (params?.offset) queryParams.set("offset", params.offset.toString());

  const queryString = queryParams.toString();
  const url = `/chat/${chatId}/history${queryString ? `?${queryString}` : ""}`;

  return apiRequest<undefined, ChatHistoryResponse>(url, "get");
}

export async function deleteChat(chatId: string) {
  return apiRequest<undefined, DeleteChatResponse>(`/chat/${chatId}`, "delete");
}

export async function askQuestionStream(
  chatId: string,
  payload: AskQuestionRequest,
  user: User | null,
  onChunk: (chunk: string) => void,
  onComplete: (message: ChatMessage) => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
  const url = `${baseURL}/chat/${chatId}/ask/stream`;

  try {
    let authToken: string | undefined;

    if (user) {
      try {
        authToken = await user.getIdToken();
      } catch (error) {
        console.warn("Failed to get ID token, trying cookie:", error);
        authToken = Cookies.get("auth-token");
      }
    } else {
      authToken = Cookies.get("auth-token");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        const jsonData = line.substring(6);

        try {
          const parsed = JSON.parse(jsonData);

          if (parsed.error) {
            onError?.(new Error(parsed.error));
            return;
          }

          if (parsed.done && parsed.message) {
            onComplete(parsed.message);
          } else if (parsed.chunk) {
            onChunk(parsed.chunk);
          }
        } catch (e) {
          console.error("Failed to parse SSE data:", jsonData, e);
        }
      }
    }
  } catch (error) {
    console.error("Streaming error:", error);
    onError?.(error instanceof Error ? error : new Error("Streaming failed"));
  }
}
