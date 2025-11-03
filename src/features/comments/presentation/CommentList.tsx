'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCommentsForCourse } from '../application/useComments';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface CommentListProps {
  courseId: string;
}

export function CommentList({ courseId }: CommentListProps) {
  const [page, setPage] = useState(0);
  const limit = 20;
  const offset = page * limit;

  const {
    data: commentsData,
    isLoading,
    error,
  } = useCommentsForCourse(courseId, limit, offset, null);

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load comments. Please try again.
      </div>
    );
  }

  const comments = commentsData?.comments || [];
  const total = commentsData?.total || 0;
  const hasMore = offset + comments.length < total;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({total})
        </h3>
        <CommentForm courseId={courseId} />
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                courseId={courseId}
              />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={isLoading}
                >
                  Load More Comments
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
