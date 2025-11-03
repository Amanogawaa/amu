'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to the new simplified route structure
const ChapterPage = () => {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  useEffect(() => {
    router.replace(`/chapters/${chapterId}`);
  }, [chapterId, router]);

  return null;
};

export default ChapterPage;
