'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  executeCode,
  executeAndSaveCode,
  getWorkspace,
  saveWorkspace,
  getSupportedLanguages,
} from '@/server/features/code-playground';
import { ExecutionRequest } from '@/server/features/code-playground/types';

export function useExecuteCode() {
  return useMutation({
    mutationFn: (request: ExecutionRequest) => executeCode(request),
  });
}

export function useExecuteAndSave() {
  return useMutation({
    mutationFn: (request: ExecutionRequest) => executeAndSaveCode(request),
  });
}

export function useWorkspace(lessonId: string) {
  return useQuery({
    queryKey: ['workspace', lessonId],
    queryFn: () => getWorkspace(lessonId),
    enabled: !!lessonId,
  });
}

export function useSaveWorkspace() {
  return useMutation({
    mutationFn: (data: {
      lessonId: string;
      courseId: string;
      code: string;
      language: string;
    }) => saveWorkspace(data),
  });
}

export function useSupportedLanguages() {
  return useQuery({
    queryKey: ['supported-languages'],
    queryFn: getSupportedLanguages,
  });
}
