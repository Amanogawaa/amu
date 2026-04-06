import { createOrGetChat } from "@/server/features/lesson-assistant";
import { useMutation } from "@tanstack/react-query";

export function useCreateChat() {
  return useMutation({
    mutationFn: async (lessonId: string) => {
      return await createOrGetChat({ lessonId });
    },
  });
}
