'use client';

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CreateCoursePayload } from '@/server/features/course/types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import handleCreateCourse from '../../application/handleCreateCourse';
import { CourseFormValues, courseFormSchema } from '../../domain/CourseSchema';

interface CourseFormProps {
  initialValues?: Partial<CourseFormValues>;
  onSubmit: (payload: CreateCoursePayload) => void;
  isPending: boolean;
  isEdit?: boolean;
}

const CreateCourseForm = ({
  initialValues,
  onSubmit,
  isPending,
  isEdit,
}: CourseFormProps) => {
  const defaultValues = useMemo(
    () => ({
      topic: '',
      category: 'Programming',
      level: 'beginner' as const,
      language: 'english',
      duration: '5 hours',
      noOfModules: 5,
      ...initialValues,
    }),
    [initialValues]
  );

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">
          {isEdit ? 'Edit Course' : 'Create Your Course'}
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to generate an AI-powered course
        </p>
      </div>

      <Form {...form}>
        <form
          method="post"
          noValidate
          className="space-y-6"
          onSubmit={form.handleSubmit(() =>
            handleCreateCourse(form.getValues(), (payload) => onSubmit(payload))
          )}
        >
          {/* Topic Field */}
          <FormField
            name="topic"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Topic *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g., Introduction to Machine Learning"
                    type="text"
                    disabled={isPending}
                    className="rounded-lg border border-secondary p-5 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                  />
                </FormControl>
                <FormDescription className="text-foreground text-xs">
                  What would you like to learn about?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Level Field */}
            <FormField
              name="level"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-lg border border-secondary p-5 focus:border-secondary focus:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            {/* only one category for now since this only focuses on cs/it students */}
            <FormField
              name="category"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Input
                    {...field}
                    placeholder="e.g., Computer Science"
                    type="text"
                    disabled
                    className="rounded-lg border border-secondary p-5 text-base placeholder:text-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Field */}
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., 2 hours, 3 weeks"
                      type="text"
                      disabled={isPending}
                      className="rounded-lg border border-secondary p-5 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                    />
                  </FormControl>
                  <FormDescription className="text-foreground text-xs">
                    Estimated time to complete
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Modules */}
            <FormField
              name="noOfModules"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Modules *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      max={20}
                      disabled={isPending}
                      className="rounded-lg border border-secondary p-5 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="text-foreground text-xs">
                    How many chapters? (1-20)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 text-base rounded-lg bg-primary p-5 text-primary-foreground hover:bg-foreground/80"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Course...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isEdit ? 'Update Course' : 'Generate Course'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
