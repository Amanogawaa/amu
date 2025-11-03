import z from 'zod';

export const moduleFormSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  courseName: z
    .string()
    .min(5, 'Course name must be at least 5 characters')
    .max(100, 'Course name must be at most 100 characters'),
  courseDescription: z
    .string()
    .min(10, 'Course description must be at least 10 characters'),
  learningOutcomes: z
    .array(
      z.string().min(5, 'Each learning outcome must be at least 5 characters')
    )
    .min(1, 'At least one learning outcome is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced'], {
    message: 'Level is required',
  }),
  duration: z.string().min(1, 'Duration is required'),
  noOfModules: z
    .number({ error: 'Number of modules must be a number' })
    .min(1, 'There must be at least 1 module'),
  prerequisites: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
});

export type ModuleFormValues = z.infer<typeof moduleFormSchema>;
