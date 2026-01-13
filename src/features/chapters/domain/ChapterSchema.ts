import z from "zod";

export const handleCreateChapter = z.object({
  moduleId: z.string().min(1, "Course ID is required"),
  courseName: z.string().min(1, "Course name is required"),
  moduleName: z.string().min(1, "Module name is required"),
  moduleDescription: z.string().min(1, "Module description is required"),
  moduleLearningObjectives: z
    .array(z.string().min(1, "Learning objective cannot be empty"))
    .min(1, "At least one learning objective is required"),
  moduleKeySkills: z
    .array(z.string().min(1, "Key skill cannot be empty"))
    .min(1, "At least one key skill is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  estimatedChapterCount: z
    .number()
    .min(1, "Estimated chapter count is required"),
  moduleDuration: z.string().min(1, "Duration is required"),
  level: z.string().min(1, "Level is required"),
  language: z.string().min(1, "Language is required"),
  moduleOrder: z.number().min(1, "Module order is required"),
});

export type ChapterFormValues = z.infer<typeof handleCreateChapter>;
