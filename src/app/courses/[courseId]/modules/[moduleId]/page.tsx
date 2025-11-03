'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect to the new simplified route structure
const ModulePage = () => {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  useEffect(() => {
    // Redirect to the new simplified route
    router.replace(`/modules/${moduleId}`);
  }, [moduleId, router]);

  return null;
};

export default ModulePage;
