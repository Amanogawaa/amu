"use client";
import { useQuery } from "@tanstack/react-query";
import CourseCard from "@/components/course/course-card";
import axiosInstance from "@/api/axios-client";
import Loader from "../global/loader";

async function getCourses() {
  try {
    const response = await axiosInstance.get("/courses");
    console.log(response);
    return response.data;
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

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.log("❌ Showing error state:", error.message);
  }

  return (
    <main className="flex h-full w-full flex-col">
      <CourseCard data={courses.data} />
    </main>
  );
}
