"use client";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/course-card";

async function getCourses() {
  try {
    const url = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/api/course`;

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }

    const data = await response.json();

    return data.courses || [];
  } catch (error) {
    throw error;
  }
}

export default function CoursePage() {
  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  console.log("📋 Query state:", {
    coursesLength: courses?.length,
    isLoading,
    hasError: !!error,
  });

  if (isLoading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    console.log("❌ Showing error state:", error.message);
  }

  return (
    <main className="flex h-full w-full flex-col">
      <CourseCard courses={courses} />
    </main>
  );
}
