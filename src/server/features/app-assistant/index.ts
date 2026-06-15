import apiRequest from "@/server/helpers/apiRequest";
import type {
  AskAppQuestionData,
  AskAppQuestionResponse,
  CreateAppChatResponse,
  GetAppChatHistoryResponse,
} from "./types";

export const createOrGetAppChat = async (): Promise<CreateAppChatResponse> => {
  return apiRequest<undefined, CreateAppChatResponse>(
    "/assistant/app/chat",
    "post"
  );
};

export const getAppChatHistory = async (
  chatId: string,
  options?: { limit?: number; offset?: number },
): Promise<GetAppChatHistoryResponse> => {
  const queryParams = new URLSearchParams();
  if (options?.limit) queryParams.append("limit", options.limit.toString());
  if (options?.offset) queryParams.append("offset", options.offset.toString());

  const queryString = queryParams.toString();
  const url = `/assistant/app/chat/${chatId}/history${
    queryString ? `?${queryString}` : ""
  }`;

  return apiRequest<undefined, GetAppChatHistoryResponse>(url, "get");
};

export const askAppQuestion = async (
  chatId: string,
  data: AskAppQuestionData,
): Promise<AskAppQuestionResponse> => {
  return apiRequest<AskAppQuestionData, AskAppQuestionResponse>(
    `/assistant/app/chat/${chatId}/ask`,
    "post",
    data,
  );
};

export const deleteAppChat = async (chatId: string): Promise<void> => {
  return apiRequest<undefined, void>(`/assistant/app/chat/${chatId}`, "delete");
};
