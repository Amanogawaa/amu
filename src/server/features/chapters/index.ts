import apiRequest from "@/server/helpers/apiRequest";
import { Chapter, CreateChapterPayload } from "./types";

export async function getChapters(courseId: string) {
  return apiRequest<null, Chapter[]>(`${courseId}/chapters`, "get");
}

export async function getChapter(chapterId: string) {
  return apiRequest<null, Chapter>(`chapters/${chapterId}`, "get");
}

export async function createChapter(
  payload: CreateChapterPayload
): Promise<Chapter> {
  return apiRequest<CreateChapterPayload, Chapter>("chapter", "post", payload);
}
