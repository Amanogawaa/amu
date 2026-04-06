'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useUploadCapstoneScreenshot, useDeleteCapstoneScreenshot } from '@/features/capstone/application/useUploadCapstoneScreenshot';

interface ScreenshotManagerProps {
  submissionId: string;
  screenshots: string[];
  canEdit?: boolean;
}

export function ScreenshotManager({
  submissionId,
  screenshots = [],
  canEdit = false,
}: ScreenshotManagerProps) {
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadCapstoneScreenshot();
  const deleteMutation = useDeleteCapstoneScreenshot();

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

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Maximum file size is 10MB',
      });
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        submissionId,
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

  const handleDelete = async (screenshotUrl: string) => {
    if (!confirm('Are you sure you want to delete this screenshot?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        submissionId,
        screenshotUrl,
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
    // The backend serves uploads at /uploads, so we can use it directly
    return url.startsWith('/') ? url : `/${url}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Screenshots ({screenshots.length})
          </CardTitle>
          {canEdit && (
            <div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="screenshot-upload"
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
                    Upload Screenshot
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {screenshots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">
              {canEdit
                ? 'No screenshots yet. Upload screenshots to showcase your work!'
                : 'No screenshots available for this submission.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((screenshotUrl, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden border bg-muted aspect-video"
              >
                <Image
                  src={getImageUrl(screenshotUrl)}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {canEdit && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(screenshotUrl)}
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
                  href={getImageUrl(screenshotUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0"
                  title="Click to view full size"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

