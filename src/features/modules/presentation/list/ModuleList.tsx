'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, LockIcon, PlayCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckCircle2Icon } from 'lucide-react';
import { useMemo } from 'react';
import { useGetModules } from '@/features/modules/application/useGetModules';
import { Separator } from '@radix-ui/react-separator';
import Link from 'next/link';
import { Module } from '@/server/features/modules/types';
import ModuleForm from '../form/ModuleForm';

// interface Module {
//   id: string;
//   moduleName: string;
//   description: string;
//   duration: string;
//   order: number;
//   isCompleted?: boolean;
//   isLocked?: boolean;
// }

interface ModuleListProps {
  Modules?: Module[];
  courseId: string;
}

export const ModuleList = ({ Modules, courseId }: ModuleListProps) => {
  const { data } = useGetModules(courseId);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            Course Modules
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {data?.length} {data?.length === 1 ? 'Module' : 'Modules'}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        {!data || data.length === 0 ? (
          <ModuleForm courseId={courseId} />
        ) : (
          <div className="space-y-3">
            {data?.map((module, index) => (
              <div key={module.id}>
                <div className="flex items-start gap-4 p-4 rounded-lg transition-colors bg-muted/30 hover:bg-muted/50 cursor-pointer">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background border">
                    <PlayCircleIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {module.moduleName}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {module.moduleDescription}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {module.estimatedDuration}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 h-8 text-xs"
                      asChild
                    >
                      <Link href={`/modules/${module.id}`}>View Module</Link>
                    </Button>
                  </div>
                </div>
                {index < data.length - 1 && <Separator className="my-3" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
