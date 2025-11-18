'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCapstoneSubmission } from '../../application/useCreateCapstoneSubmission';
import { useUpdateCapstoneSubmission } from '../../application/useUpdateCapstoneSubmission';
import { Loader2, Github, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/features/auth/application/AuthContext';
import type { CapstoneSubmission } from '@/server/features/capstone/types';

const submissionFormSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  githubRepoUrl: z
    .string()
    .url('Must be a valid URL')
    .refine(
      (url) => url.includes('github.com'),
      'Must be a GitHub repository URL'
    ),
});

type SubmissionFormValues = z.infer<typeof submissionFormSchema>;

interface CapstoneSubmissionFormProps {
  courseId: string;
  guidelineId: string;
  submission?: CapstoneSubmission;
  onSuccess?: () => void;
}

export function CapstoneSubmissionForm({
  courseId,
  guidelineId,
  submission,
  onSuccess,
}: CapstoneSubmissionFormProps) {
  const { githubLinked, linkGithub } = useAuth();
  const [isLinking, setIsLinking] = useState(false);
  const createSubmission = useCreateCapstoneSubmission();
  const updateSubmission = useUpdateCapstoneSubmission();

  const isEditing = !!submission;

  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionFormSchema),
    defaultValues: {
      title: submission?.title || '',
      description: submission?.description || '',
      githubRepoUrl: submission?.githubRepoUrl || '',
    },
  });

  const handleLinkGithub = async () => {
    setIsLinking(true);
    try {
      await linkGithub();
    } finally {
      setIsLinking(false);
    }
  };

  const onSubmit = async (values: SubmissionFormValues) => {
    if (isEditing && submission) {
      await updateSubmission.mutateAsync({
        id: submission.id,
        payload: values,
      });
    } else {
      await createSubmission.mutateAsync({
        courseId,
        guidelineId,
        ...values,
      });
    }
    onSuccess?.();
  };

  if (!githubLinked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link Your GitHub Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Github className="h-4 w-4" />
            <AlertDescription>
              You need to link your GitHub account to submit a capstone project.
              This allows us to verify your repository and fetch project
              details.
            </AlertDescription>
          </Alert>
          <Button
            onClick={handleLinkGithub}
            disabled={isLinking}
            className="w-full"
          >
            {isLinking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Linking...
              </>
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Link GitHub Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Submission' : 'Submit Your Capstone Project'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Awesome Project"
                      {...field}
                      disabled={
                        createSubmission.isPending || updateSubmission.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Give your project a clear, descriptive title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what your project does, the technologies you used, and any challenges you overcame..."
                      className="min-h-[120px]"
                      {...field}
                      disabled={
                        createSubmission.isPending || updateSubmission.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of your project (minimum 50
                    characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubRepoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Repository URL</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                        disabled={
                          createSubmission.isPending ||
                          updateSubmission.isPending
                        }
                      />
                      {field.value && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          asChild
                        >
                          <a
                            href={field.value}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Link to your public GitHub repository
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={
                  createSubmission.isPending || updateSubmission.isPending
                }
                className="flex-1"
              >
                {createSubmission.isPending || updateSubmission.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Submitting...'}
                  </>
                ) : (
                  <>{isEditing ? 'Update Submission' : 'Submit Project'}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
