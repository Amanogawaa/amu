'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to the new simplified route structure
const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonsId as string;

  useEffect(() => {
    router.replace(`/lessons/${lessonId}`);
  }, [lessonId, router]);

  return null;
};

export default LessonPage;
