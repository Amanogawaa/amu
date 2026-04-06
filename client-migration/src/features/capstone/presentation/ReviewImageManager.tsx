'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  useUploadCapstoneReviewImage,
  useDeleteCapstoneReviewImage,
} from '../application/useCapstoneReviewImages';
import { cn } from '@/lib/utils';

interface ReviewImageManagerProps {
  reviewId: string;
  images: string[];
  canEdit?: boolean;
  className?: string;
}

export function ReviewImageManager({
  reviewId,
  images = [],
  canEdit = false,
  className,
}: ReviewImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadCapstoneReviewImage();
  const deleteMutation = useDeleteCapstoneReviewImage();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please select a JPEG, PNG, or WebP image',
      });
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB',
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        reviewId,
        file,
      });

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDelete = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        reviewId,
        imageUrl,
      });
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getImageUrl = (url: string) => {
    // If it's already a full URL, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Use relative path - Next.js will handle the rewrite to the API server
    return url.startsWith('/') ? url : `/${url}`;
  };

  if (!canEdit && images.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)}>
      {canEdit && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Images ({images.length})</span>
          </div>
          <div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id={`review-image-upload-${reviewId}`}
              disabled={uploadMutation.isPending}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Add Image
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border bg-muted aspect-video"
            >
              <Image
                src={getImageUrl(imageUrl)}
                alt={`Review image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              {canEdit && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(imageUrl)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              )}
              <a
                href={getImageUrl(imageUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
                title="Click to view full size"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

