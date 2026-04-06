'use client';

import {
  pistonExecuteCode,
  pistonGetSupportedLanguages,
} from '@/server/features/code-playground';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGetPistonSupportedLanguages() {
  return useQuery({
    queryKey: ['piston-supported-languages'],
    queryFn: async () => {
      return await pistonGetSupportedLanguages();
    },
  });
}

export function usePistonExecuteCode() {
  return useMutation({
    mutationFn: (request: any) => pistonExecuteCode(request),
  });
}
