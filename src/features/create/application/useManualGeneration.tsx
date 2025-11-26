"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { showErrorToast } from "@/lib/errorHandling";
import { queryKeys } from "@/lib/queryKeys";
import { createChapter } from "@/server/features/chapters";
import type { CreateChapterPayload } from "@/server/features/chapters/types";
import { createLesson } from "@/server/features/lessons";
import type { CreateLessonPayload } from "@/server/features/lessons/types";

export function useManualChapterGeneration(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChapterPayload) => createChapter(payload),
    onSuccess: (_, variables) => {
      toast.success(`Chapters generated for ${variables.moduleName}`);

      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.list(courseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.modules.detail(variables.moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chapters.list(variables.moduleId),
      });
      queryClient.invalidateQueries({ queryKey: ["all-chapters"] });
      queryClient.invalidateQueries({ queryKey: ["all-lessons"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error) => {
      showErrorToast(
        error,
        "Failed to generate chapters. Please try again in a moment."
      );
    },
  });
}

export function useManualLessonGeneration(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLessonPayload) => createLesson(payload),
    onSuccess: (_, variables) => {
      toast.success(`Lessons generated for ${variables.chapterName}`);

      queryClient.invalidateQueries({
        queryKey: queryKeys.lessons.list(variables.chapterId),
      });
      queryClient.invalidateQueries({ queryKey: ["all-lessons"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.validation(courseId),
      });
    },
    onError: (error) => {
      showErrorToast(
        error,
        "Failed to generate lessons. Please try again in a moment."
      );
    },
  });
}
