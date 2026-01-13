"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Sparkles,
  Wand2,
  BookOpen,
  Tag,
  GraduationCap,
  Globe,
  Clock,
  Layers,
  FileText,
} from "lucide-react";
import { FullGenerationRequest } from "@/server/features/course/types";

const fullGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  language: z.string().min(1, "Language is required"),
  duration: z.string().min(1, "Duration is required"),
  noOfChapters: z.number().min(1).max(10),
  userInstructions: z.string().optional(),
});

type FullGenerationFormValues = z.infer<typeof fullGenerationSchema>;
1;
interface FullGenerationFormProps {
  onSubmit: (payload: FullGenerationRequest) => void;
  isGenerating: boolean;
}

export function FullGenerationForm({
  onSubmit,
  isGenerating,
}: FullGenerationFormProps) {
  const defaultValues = useMemo(
    () => ({
      topic: "",
      category: "Programming",
      level: "beginner" as const,
      language: "English",
      duration: "5 hours",
      noOfChapters: 5,
      userInstructions: "",
    }),
    []
  );

  const form = useForm<FullGenerationFormValues>({
    resolver: zodResolver(fullGenerationSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const handleSubmit = (values: FullGenerationFormValues) => {
    onSubmit(values as FullGenerationRequest);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Topic Field */}
        <FormField
          name="topic"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Topic *</FormLabel>
              <FormControl>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="e.g., Full Stack Web Development"
                    type="text"
                    disabled={isGenerating}
                    className="rounded-lg border border-secondary p-5 pl-10 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                  />
                </div>
              </FormControl>
              <FormDescription>
                What is the main topic of your course?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isGenerating}
              >
                <FormControl>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <SelectTrigger
                      disabled
                      className="w-full rounded-lg border border-secondary p-5 pl-10 focus:border-secondary focus:outline-none focus-visible:ring-0"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </div>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Personal Development">
                    Personal Development
                  </SelectItem>
                </SelectContent>
              </Select>
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
                  disabled={isGenerating}
                >
                  <FormControl>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <SelectTrigger className="w-full rounded-lg border border-secondary p-5 pl-10 focus:border-secondary focus:outline-none focus-visible:ring-0">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </div>
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

          {/* Language Field */}
          <FormField
            name="language"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isGenerating}
                >
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                      <SelectTrigger
                        disabled
                        className="w-full rounded-lg border border-secondary p-5 pl-10 focus:border-secondary focus:outline-none focus-visible:ring-0"
                      >
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
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
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      placeholder="e.g., 20 hours"
                      type="text"
                      disabled={isGenerating}
                      className="rounded-lg border border-secondary p-5 pl-10 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                    />
                  </div>
                </FormControl>
                <FormDescription>Total course duration</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Number of Modules Field */}
          <FormField
            name="noOfChapters"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Chapters *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      value={field.value || ""}
                      type="number"
                      min={1}
                      max={10}
                      disabled={isGenerating}
                      className="rounded-lg border border-secondary p-5 pl-10 text-base placeholder:text-sm focus:border-secondary focus:outline-none focus-visible:ring-0 active:border-secondary"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseInt(value, 10));
                      }}
                    />
                  </div>
                </FormControl>
                <FormDescription>1-10 chapters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* User Instructions Field */}
        <FormField
          name="userInstructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Instructions (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    {...field}
                    placeholder="e.g., Focus on practical projects, include real-world examples..."
                    disabled={isGenerating}
                    className="rounded-lg min-h-[100px] pl-10"
                  />
                </div>
              </FormControl>
              <FormDescription>
                Provide specific instructions for AI generation
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isGenerating}
          className="w-full rounded-lg h-12 text-base"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Course...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Generate Full Course
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          This will generate a complete course with modules, chapters, and
          lessons. Progress will be shown in real-time.
        </p>
      </form>
    </Form>
  );
}
