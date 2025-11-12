'use client';

import useCreateCourse from '@/features/course/application/useCreateCourse';
import FullGenerationPage from '@/features/create/presentation/FullGenerationPage';

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
