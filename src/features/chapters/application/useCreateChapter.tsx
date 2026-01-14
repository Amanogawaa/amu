import { queryKeys } from "@/lib/queryKeys";
import { showErrorToast } from "@/lib/errorHandling";
import { createChapter } from "@/server/features/chapters";
import { CreateChapterPayload } from "@/server/features/chapters/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCreateChapter() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateChapterPayload) => {
      await createChapter(payload);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chapters.list(variables.moduleId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.detail(variables.moduleId),
      });

      toast.success("Chapter created successfully!");
      router.refresh();
    },

    onError: (error) => {
      showErrorToast(error, "Failed to create chapter. Please try again.");
    },
  });
}
