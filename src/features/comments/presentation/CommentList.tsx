'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedEmptyState } from '@/components/states/EnhancedEmptyState';
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
  const [showCommentForm, setShowCommentForm] = useState(false);
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
  const hasComments = comments.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({total})
        </h3>
        {(hasComments || showCommentForm) && (
          <div data-comment-form>
            <CommentForm courseId={courseId} />
          </div>
        )}
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
          <EnhancedEmptyState
            type="no-comments"
            customAction={() => setShowCommentForm(true)}
            customActionLabel="Start the Discussion"
          />
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
