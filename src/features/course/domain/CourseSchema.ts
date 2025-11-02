import z from 'zod';

export const courseFormSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  language: z.string().min(1, 'Language is required'),
  duration: z.string().min(1, 'Duration is required'),
  noOfModules: z
    .number({ error: 'Number of modules must be a number' })
    .min(1, 'There must be at least 1 module'),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
