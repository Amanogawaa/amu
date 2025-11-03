'use client';

import { Button } from '@/components/ui/button';
import { useToggleLike, useLikeStatus } from '../application/useLikes';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  courseId: string;
  className?: string;
  showCount?: boolean;
}

export function LikeButton({
  courseId,
  className = '',
  showCount = true,
}: LikeButtonProps) {
  const { data: likeStatus, isLoading } = useLikeStatus(courseId);
  const toggleLike = useToggleLike(courseId);

  const handleClick = () => {
    toggleLike.mutate();
  };

  return (
    <Button
      variant={likeStatus?.liked ? 'default' : 'outline'}
      size="sm"
      onClick={handleClick}
      disabled={isLoading || toggleLike.isPending}
      className={cn('gap-2', className)}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all',
          likeStatus?.liked && 'fill-current'
        )}
      />
      {showCount && (
        <span className="text-sm">{likeStatus?.likesCount || 0}</span>
      )}
    </Button>
  );
}
