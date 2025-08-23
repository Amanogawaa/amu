"use client";

import ClientCoursePage from "@/components/course/course-page";
import { QueryClientWrapper } from "@/lib/query-client-wrapper";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <QueryClientWrapper>
      <ClientCoursePage />
    </QueryClientWrapper>
  );
}
