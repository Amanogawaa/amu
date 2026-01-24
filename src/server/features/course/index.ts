import apiRequest from "@/server/helpers/apiRequest";
import {
  Course,
  CourseFilters,
  CourseValidationResponse,
  CreateCoursePayload,
  FullGenerationRequest,
  FullGenerationResponse,
  ListCoursesResponse,
} from "./types";
import { User } from "firebase/auth";
import Cookies from "js-cookie";

export async function listCourses(
  page: number,
  filters?: CourseFilters,
): Promise<ListCoursesResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters) {
    if (filters.category) {
      params.append("category", filters.category);
    }
    if (filters.level) {
      params.append("level", filters.level);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }

    if (filters.publish !== undefined) {
      params.append("publish", filters.publish.toString());
    }

    if (filters.draft !== undefined) {
      params.append("draft", filters.draft.toString());
    }
  }

  const queryString = params.toString();
  const url = `/courses?${queryString ? `${queryString}` : ""}`;

  return apiRequest<null, ListCoursesResponse>(url, "get");
}

export async function listMyCourses(
  page: number,
  filters?: CourseFilters,
): Promise<ListCoursesResponse> {
  const params = new URLSearchParams();
  params.append("page", page.toString());

  if (filters) {
    if (filters.category) {
      params.append("category", filters.category);
    }
    if (filters.level) {
      params.append("level", filters.level);
    }
    if (filters.language) {
      params.append("language", filters.language);
    }

    if (filters.publish !== undefined) {
      params.append("publish", filters.publish.toString());
    }

    if (filters.draft !== undefined) {
      params.append("draft", filters.draft.toString());
    }
  }

  const queryString = params.toString();
  const url = `/my-courses?${queryString ? `${queryString}` : ""}`;

  return apiRequest<null, ListCoursesResponse>(url, "get");
}

export async function getCourseById(courseId: string): Promise<Course> {
  return apiRequest<null, Course>(`/courses/${courseId}`, "get");
}

export async function createCourse(
  payload: CreateCoursePayload,
): Promise<Course> {
  return apiRequest<CreateCoursePayload, Course>("/courses", "post", payload);
}

export async function validateCourse(
  courseId: string,
): Promise<{ data: CourseValidationResponse; message: string }> {
  return apiRequest<null, { data: CourseValidationResponse; message: string }>(
    `/courses/${courseId}/validate`,
    "get",
  );
}

export async function publishCourse(
  courseId: string,
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/publish`,
    "patch",
  );
}

export async function unpublishCourse(
  courseId: string,
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/unpublish`,
    "patch",
  );
}

export async function moveCourseToDraft(
  courseId: string,
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/draft`,
    "patch",
  );
}

export async function restoreCourseFromDraft(
  courseId: string,
): Promise<{ data: Course; message: string }> {
  return apiRequest<null, { data: Course; message: string }>(
    `/courses/${courseId}/undraft`,
    "patch",
  );
}

export async function generateFullCourse(
  payload: FullGenerationRequest,
): Promise<FullGenerationResponse> {
  return apiRequest<FullGenerationRequest, FullGenerationResponse>(
    "/courses/generate-full",
    "post",
    payload,
  );
}

export async function generateFullCourseStream(
  payload: FullGenerationRequest,
  user: User | null,
  onChunk: (chunk: string) => void,
  onError?: (error: Error) => void,
): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
  const url = `${baseURL}/courses/generate-full/stream`;

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

export async function deleteCourse(courseId: string): Promise<void> {
  return apiRequest<null, void>(`/courses/${courseId}`, "delete");
}
