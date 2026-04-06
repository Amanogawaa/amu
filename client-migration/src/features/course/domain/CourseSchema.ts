import { User } from "lucide-react";
import z from "zod";

export const courseFormSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  category: z.string().min(1, "Category is required"),
  level: z.string().min(1, "Level is required"),
  language: z.string().min(1, "Language is required"),
  duration: z.string().min(1, "Duration is required"),
  noOfChapters: z
    .number({ error: "Number of chapters must be a number" })
    .min(1, "There must be at least 1 chapter"),
  userInstructions: z.string().optional(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
