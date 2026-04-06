import { CreateCoursePayload } from "@/server/features/course/types";
import { CourseFormValues } from "../domain/CourseSchema";

export default function handleCreateCourse(
  values: CourseFormValues,
  onSubmit: (payload: CreateCoursePayload) => void
) {
  const payload: CreateCoursePayload = {
    topic: values.topic,
    category: values.category,
    level: values.level,
    language: values.language,
    duration: values.duration,
    noOfChapters: values.noOfChapters,
    userInstructions: values.userInstructions,
  };

  onSubmit(payload);
}
