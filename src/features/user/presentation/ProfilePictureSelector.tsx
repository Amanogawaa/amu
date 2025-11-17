'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Camera, Check, Upload } from 'lucide-react';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useUploadProfilePicture } from '../application/useUser';
import { toast } from 'sonner';
import { logger } from '@/lib/loggers';

const PROFILE_PICTURES = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  src: `/profile_${i + 1}.png`,
  alt: `Profile ${i + 1}`,
}));

interface ProfilePictureSelectorProps {
  currentPhotoURL?: string | null;
}

export function ProfilePictureSelector({
  currentPhotoURL,
}: ProfilePictureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<string | null>(
    currentPhotoURL || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfilePicture } = useAuth();
  const uploadMutation = useUploadProfilePicture();

  const handleSelectPicture = (pictureSrc: string) => {
    setSelectedPicture(pictureSrc);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type', {
        description: 'Please select a JPEG, PNG, or WebP image',
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large', {
        description: 'Maximum file size is 5MB',
      });
      return;
    }

    setSelectedFile(file);
    setSelectedPicture(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSave = async () => {
    try {
      if (selectedFile) {
        const photoURL = await uploadMutation.mutateAsync(selectedFile);
        await updateProfilePicture(photoURL);
        toast.success('Profile picture uploaded successfully');
      } else if (selectedPicture) {
        // Use predefined picture
        await updateProfilePicture(selectedPicture);
        toast.success('Profile picture updated successfully');
      }
      setIsOpen(false);
    } catch (error) {
      logger.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const isUpdating = uploadMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="h-4 w-4" />
          Change Picture
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Profile Picture</DialogTitle>
          <DialogDescription>
            Select a profile picture from the options below or upload your own
          </DialogDescription>
        </DialogHeader>

        {/* Upload custom image section */}
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Custom Image
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            JPG, PNG, or WebP (max 5MB)
          </p>
          {previewUrl && (
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary ring-2 ring-primary">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Predefined pictures grid */}
        <div className="grid grid-cols-4 gap-4 py-4">
          {PROFILE_PICTURES.map((picture) => (
            <button
              key={picture.id}
              onClick={() => handleSelectPicture(picture.src)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedPicture === picture.src
                  ? 'border-primary ring-2 ring-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={picture.src}
                alt={picture.alt}
                fill
                className="object-cover"
              />
              {selectedPicture === picture.src && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedPicture || isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
