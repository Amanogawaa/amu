'use client';

import useCreateCourse from '@/features/course/application/useCreateCourse';
import CreateCourseForm from '@/features/course/presentation/CreateCourseForm';
import React from 'react';

const CreatePage = () => {
  const { mutate, isPending } = useCreateCourse();

  return (
    <section className="flex flex-col min-h-screen w-full">
      <div className="container mx-auto max-w-2xl my-auto">
        <CreateCourseForm
          onSubmit={(payload) => {
            mutate(payload);
          }}
          isPending={isPending}
        />
      </div>
    </section>
  );
};

export default CreatePage;
