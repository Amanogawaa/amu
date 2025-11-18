'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useCreateCapstoneReview } from '../../application/useCreateCapstoneReview';
import { useUpdateCapstoneReview } from '../../application/useUpdateCapstoneReview';
import { Loader2, Star } from 'lucide-react';
import type { CapstoneReview } from '@/server/features/capstone/types';

const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  feedback: z.string().min(20, 'Feedback must be at least 20 characters'),
  highlights: z.string().optional(),
  suggestions: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface CapstoneReviewFormProps {
  capstoneSubmissionId: string;
  review?: CapstoneReview;
  onSuccess?: () => void;
}

export function CapstoneReviewForm({
  capstoneSubmissionId,
  review,
  onSuccess,
}: CapstoneReviewFormProps) {
  const createReview = useCreateCapstoneReview();
  const updateReview = useUpdateCapstoneReview();

  const isEditing = !!review;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: review?.rating || 0,
      feedback: review?.feedback || '',
      highlights: review?.highlights?.join('\n') || '',
      suggestions: review?.suggestions?.join('\n') || '',
    },
  });

  const selectedRating = form.watch('rating');

  const onSubmit = async (values: ReviewFormValues) => {
    const payload = {
      capstoneSubmissionId,
      rating: values.rating,
      feedback: values.feedback,
      highlights: values.highlights
        ? values.highlights.split('\n').filter((h) => h.trim())
        : [],
      suggestions: values.suggestions
        ? values.suggestions.split('\n').filter((s) => s.trim())
        : [],
    };

    if (isEditing && review) {
      await updateReview.mutateAsync({
        id: review.id,
        payload,
      });
    } else {
      await createReview.mutateAsync(payload);
    }
    form.reset();
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Review' : 'Write a Review'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => field.onChange(rating)}
                          className="transition-transform hover:scale-110"
                          disabled={
                            createReview.isPending || updateReview.isPending
                          }
                        >
                          <Star
                            className={`h-8 w-8 ${
                              rating <= selectedRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Rate this project from 1 to 5 stars
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this project. What did you like? What could be improved?"
                      className="min-h-[120px]"
                      {...field}
                      disabled={
                        createReview.isPending || updateReview.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Provide constructive feedback (minimum 20 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highlights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you like about this project? (One per line)"
                      className="min-h-[80px]"
                      {...field}
                      disabled={
                        createReview.isPending || updateReview.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    List the strong points of this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suggestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What could be improved? (One per line)"
                      className="min-h-[80px]"
                      {...field}
                      disabled={
                        createReview.isPending || updateReview.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Offer constructive suggestions for improvement
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={createReview.isPending || updateReview.isPending}
              className="w-full"
            >
              {createReview.isPending || updateReview.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>{isEditing ? 'Update Review' : 'Submit Review'}</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
