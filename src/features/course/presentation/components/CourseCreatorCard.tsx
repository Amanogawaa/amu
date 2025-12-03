'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublicProfile } from '@/features/user/application/useUser';
import { User2Icon, Calendar, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CourseCreatorCardProps {
  creatorId: string;
  createdAt?: string | Date;
  className?: string;
}

export function CourseCreatorCard({
  creatorId,
  createdAt,
  className,
}: CourseCreatorCardProps) {
  const { data: creator, isLoading } = usePublicProfile(creatorId);

  if (isLoading) {
    return (
      <Card className={cn('overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!creator) {
    return null;
  }

  const displayName =
    creator.firstName || creator.lastName
      ? `${creator.firstName || ''} ${creator.lastName || ''}`.trim()
      : 'Anonymous Creator';

  const initials =
    creator.firstName?.[0] ||
    creator.lastName?.[0] ||
    creator.email?.[0] ||
    'U';

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return null;
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'overflow-hidden border-2 hover:border-primary/40 transition-all duration-300 group',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Course Creator
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Course Creator
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/account/${creatorId}`}
            className="group/avatar relative"
          >
            <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-300" />
            <Avatar className="h-16 w-16 border-4 border-background shadow-lg ring-2 ring-primary/20 group-hover/avatar:ring-primary/50 transition-all duration-300">
              <AvatarImage
                src={creator.photoURL || '/profile_1'}
                alt={displayName}
              />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                {initials.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0 space-y-2">
            <Link href={`/account/${creatorId}`} className="block group/link">
              <h3 className="font-bold text-lg truncate group-hover/link:text-primary transition-colors duration-200">
                {displayName}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User2Icon className="h-3.5 w-3.5" />
                <span className="hover:text-primary transition-colors cursor-pointer">
                  View Profile
                </span>
              </div>
            </Link>

            {createdAt && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {formatDate(createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Decorative gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </CardContent>
    </Card>
  );
}
