import apiRequest from "@/server/helpers/apiRequest";
import { Lesson, CreateLessonPayload } from "./types";

export async function getLessons(chapterId: string) {
  return apiRequest<null, Lesson[]>(`/${chapterId}/lessons`, "get");
}

export async function getLesson(lessonId: string) {
  return apiRequest<null, Lesson>(`/lessons/${lessonId}`, "get");
}

export async function createLesson(
  payload: CreateLessonPayload
): Promise<Lesson[]> {
  return apiRequest<CreateLessonPayload, Lesson[]>("/lessons", "post", payload);
}
