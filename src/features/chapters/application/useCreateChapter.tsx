import { createChapter } from '@/server/features/chapters';
import { CreateChapterPayload } from '@/server/features/chapters/types';
import { useMutation } from '@tanstack/react-query';

export async function generateChapter() {
  return useMutation({
    mutationFn: async (payload: CreateChapterPayload) => {
      await createChapter(payload);
    },
  });
}
