import { queryKeys } from "@/lib/queryKeys";
import { getChapters } from "@/server/features/chapters";
import { useQuery } from "@tanstack/react-query";

export function useGetChapters(courseId: string) {
  return useQuery({
    queryKey: queryKeys.chapters.list(courseId),
    queryFn: async () => getChapters(courseId),
  });
}
