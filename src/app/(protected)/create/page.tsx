'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const FullGenerationPage = dynamic(
  () => import('@/features/create/presentation/FullGenerationPage'),
  {
    loading: () => (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    ),
    ssr: false,
  }
);

const CreatePage = () => {
  return (
    <section className="flex flex-col min-h-screen w-full">
      <div className="container mx-auto max-w-6xl my-auto space-y-6">
        <FullGenerationPage />
      </div>
    </section>
  );
};

export default CreatePage;
