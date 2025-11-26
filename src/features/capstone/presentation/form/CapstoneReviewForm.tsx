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
import { useUploadCapstoneReviewImage } from '../../application/useCapstoneReviewImages';
import { ReviewImageManager } from '../ReviewImageManager';
import { Loader2, Star, Upload, X, Image as ImageIcon } from 'lucide-react';
import type { CapstoneReview } from '@/server/features/capstone/types';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { toast } from 'sonner';

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
  const uploadImage = useUploadCapstoneReviewImage();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdReviewId, setCreatedReviewId] = useState<string | null>(
    review?.id || null
  );

  const isReply = review?.parentReviewId !== undefined;
  const isEditing = !!review && !isReply;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: review?.rating || (isReply ? undefined : 0),
      feedback: review?.feedback || '',
      highlights: review?.highlights?.join('\n') || '',
      suggestions: review?.suggestions?.join('\n') || '',
    },
  });

  const selectedRating = form.watch('rating');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; 

    const validFiles: File[] = [];
    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (max 5MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    setSelectedImages((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const splitIntoItems = (text: string, maxLength: number = 200): string[] => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').filter((line) => line.trim());
    const items: string[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      if (trimmed.length <= maxLength) {
        items.push(trimmed);
      } else {
       
        const sentenceRegex = /([.!?]+\s+)/g;
        const parts = trimmed.split(sentenceRegex);
        let currentItem = '';

        for (let i = 0; i < parts.length; i += 2) {
          const sentence = parts[i] || '';
          const punctuation = parts[i + 1] || '';
          const fullSentence = sentence + punctuation;

          if (fullSentence.trim().length === 0) continue;

          if ((currentItem + fullSentence).length > maxLength) {
            if (currentItem.trim()) {
              items.push(currentItem.trim());
              currentItem = '';
            }

            if (fullSentence.trim().length > maxLength) {
              const words = fullSentence.trim().split(/\s+/);
              let wordItem = '';
              
              words.forEach((word) => {
                if ((wordItem + ' ' + word).length <= maxLength) {
                  wordItem = wordItem ? wordItem + ' ' + word : word;
                } else {
                  if (wordItem) {
                    items.push(wordItem);
                  }
                  wordItem = word.length > maxLength 
                    ? word.substring(0, maxLength) 
                    : word;
                }
              });
              
              if (wordItem.trim()) {
                currentItem = wordItem;
              }
            } else {
              currentItem = fullSentence;
            }
          } else {
            currentItem += fullSentence;
          }
        }

        if (currentItem.trim()) {
          items.push(currentItem.trim());
        }
      }
    });

    return items.filter((item) => item.length > 0 && item.length <= maxLength);
  };

  const onSubmit = async (values: ReviewFormValues) => {
    let highlights: string[] = [];
    let suggestions: string[] = [];

    if (!isReply) {
      highlights = values.highlights
        ? splitIntoItems(values.highlights, 200)
        : [];
      suggestions = values.suggestions
        ? splitIntoItems(values.suggestions, 200)
        : [];

      if (highlights.length > 5) {
        toast.error('Maximum 5 highlights allowed. Please shorten your list.');
        return;
      }
      if (suggestions.length > 5) {
        toast.error('Maximum 5 suggestions allowed. Please shorten your list.');
        return;
      }
    }

    const payload = {
      capstoneSubmissionId,
      parentReviewId: isReply ? review?.parentReviewId : undefined,
      rating: isReply ? undefined : values.rating,
      feedback: values.feedback,
      highlights: isReply ? undefined : highlights,
      suggestions: isReply ? undefined : suggestions,
    };

    let reviewId: string;

    if (isEditing && review) {
      await updateReview.mutateAsync({
        id: review.id,
        payload,
      });
      reviewId = review.id;
      setCreatedReviewId(review.id);
    } else {
      const result = await createReview.mutateAsync(payload);
      reviewId = result.data.id;
      setCreatedReviewId(result.data.id);
    }

    if (selectedImages.length > 0 && reviewId) {
      try {
        await Promise.all(
          selectedImages.map((file) =>
            uploadImage.mutateAsync({
              reviewId,
              file,
            })
          )
        );
        setSelectedImages([]);
        setImagePreviews([]);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }

    form.reset();
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isReply
            ? 'Reply to Review'
            : isEditing
            ? 'Edit Review'
            : 'Write a Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating - only show for top-level reviews */}
            {!isReply && (
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
            )}

            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isReply ? 'Your Reply' : 'Your Feedback'}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        isReply
                          ? 'Write your reply...'
                          : 'Share your thoughts about this project. What did you like? What could be improved?'
                      }
                      className="min-h-[120px]"
                      {...field}
                      disabled={
                        createReview.isPending || updateReview.isPending
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {isReply
                      ? 'Share your thoughts (minimum 10 characters)'
                      : 'Provide constructive feedback (minimum 20 characters)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Highlights and Suggestions - only for top-level reviews */}
            {!isReply && (
              <>
                <FormField
                  control={form.control}
                  name="highlights"
                  render={({ field }) => {
                const lines = field.value
                  ? field.value.split('\n').filter((l: string) => l.trim())
                  : [];
                const longLines = lines.filter(
                  (line: string) => line.trim().length > 200
                );

                return (
                  <FormItem>
                    <FormLabel>Highlights</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="What did you like about this project? (One per line, max 200 characters per line)"
                          className="min-h-[80px]"
                          {...field}
                          disabled={
                            createReview.isPending || updateReview.isPending
                          }
                        />
                        {longLines.length > 0 && (
                          <p className="text-sm text-destructive mt-1">
                            {longLines.length} line(s) exceed 200 characters.
                            They will be automatically split.
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      List the strong points (one per line, max 200 characters
                      per line, max 5 items)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="suggestions"
              render={({ field }) => {
                const lines = field.value
                  ? field.value.split('\n').filter((l: string) => l.trim())
                  : [];
                const longLines = lines.filter(
                  (line: string) => line.trim().length > 200
                );

                return (
                  <FormItem>
                    <FormLabel>Suggestions</FormLabel>
                    <FormControl>
                      <div>
                        <Textarea
                          placeholder="What could be improved? (One per line, max 200 characters per line)"
                          className="min-h-[80px]"
                          {...field}
                          disabled={
                            createReview.isPending || updateReview.isPending
                          }
                        />
                        {longLines.length > 0 && (
                          <p className="text-sm text-destructive mt-1">
                            {longLines.length} line(s) exceed 200 characters.
                            They will be automatically split.
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Offer constructive suggestions (one per line, max 200
                      characters per line, max 5 items)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
                />
              </>
            )}

            {/* Image Upload Section */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Images ({selectedImages.length + (review?.images?.length || 0)})
                  </span>
                </div>
                <div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="review-image-upload"
                    multiple
                    disabled={
                      createReview.isPending ||
                      updateReview.isPending ||
                      uploadImage.isPending
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      createReview.isPending ||
                      updateReview.isPending ||
                      uploadImage.isPending
                    }
                  >
                    {uploadImage.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Add Images
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedImages.map((file, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border bg-muted aspect-video"
                    >
                      {imagePreviews[index] && (
                        <Image
                          src={imagePreviews[index]}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSelectedImage(index)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {file.name.length > 15
                          ? `${file.name.substring(0, 15)}...`
                          : file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Existing Images (when editing) */}
              {createdReviewId && review?.images && review.images.length > 0 && (
                <div className="pt-2">
                  <ReviewImageManager
                    reviewId={createdReviewId}
                    images={review.images}
                    canEdit={true}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                createReview.isPending ||
                updateReview.isPending ||
                uploadImage.isPending
              }
              className="w-full"
            >
              {createReview.isPending ||
              updateReview.isPending ||
              uploadImage.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                isEditing ? 'Update Review' : 'Submit Review'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
