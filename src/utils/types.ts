import { z } from "zod";

export interface Course {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  category: string;
  topic: string;
  level: string;
  language: string;
  prerequisites?: string;
  learningOutcomes: string;
  duration: string;
  noOfChapters: number;
  publish: boolean;
  includeCertificate: boolean;
  bannerUrl?: string;
  lastUpdated: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  estimatedDuration: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: string;
  description: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  order: number;
}

export const LESSONSCHEMA = z.object({
  lessons: z.array(
    z.object({
      lessonId: z.string(),
      title: z.string(),
      type: z.enum(["video", "article", "quiz", "assignment"]),
      description: z.string(),
      duration: z.string(),
      content: z.string().optional(),
      videoUrl: z.string().optional(),
      resources: z
        .array(
          z.object({
            title: z.string(),
            url: z.string(),
            type: z.enum(["pdf", "link", "doc", "image"]),
          })
        )
        .optional(),
    })
  ),
});

export const CHAPTERSCHEMA = z.object({
  chapters: z.array(
    z.object({
      chapterId: z.number(),
      title: z.string(),
      description: z.string(),
      estimatedDuration: z.string(),
      lessons: z.array(
        z.object({
          lessonId: z.string(),
          title: z.string(),
          type: z.string(),
          duration: z.string(),
          description: z.string(),
        })
      ),
    })
  ),
});

export const COURSESCHEMA = z.object({
  course: z.object({
    name: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.string(),
    topic: z.string(),
    level: z.string(),
    language: z.string().default("en"),
    prerequisites: z.string().optional(),
    learningOutcomes: z.array(z.string()),
    duration: z.string(),
    noOfChapters: z.number(),
    publish: z.boolean(),
    includeCertificate: z.boolean(),
    courseBanner: z.string(),
  }),
});

export const AUTHSCHEMA = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter" })
    .regex(/[0-9]/, { error: "Password must contain at least one number" }),
});

export type AuthFormData = z.infer<typeof AUTHSCHEMA>;

export type AuthState = {
  data: object | null;
  errors: { email?: string; password?: string; general?: string } | null;
};
