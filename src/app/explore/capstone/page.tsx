'use client';

import { CapstoneGallery } from '@/features/capstone/presentation';
import { Sparkles } from 'lucide-react';

export default function CapstoneGalleryPage() {
  return (
    <div className="container mx-auto max-w-5xl  py-8 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Capstone Projects
          </h1>
        </div>
        <p className="text-muted-foreground">
          Explore student capstone projects from various courses. Get inspired
          and share your own!
        </p>
      </div>

      <CapstoneGallery limit={12} />
    </div>
  );
}
