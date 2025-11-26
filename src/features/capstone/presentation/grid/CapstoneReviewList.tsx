'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCapstoneReviews } from '../../application/useCapstoneReviews';
import { useAuth } from '@/features/auth/application/AuthContext';
import { ReviewImageManager } from '../ReviewImageManager';
import { Star, MoreVertical, Edit, Trash2, AlertCircle, MessageSquare, Reply } from 'lucide-react';
import { Empty } from '@/components/ui/empty';
import { useState } from 'react';
import { CapstoneReviewForm } from '../form/CapstoneReviewForm';
import type { CapstoneReview } from '@/server/features/capstone/types';

interface CapstoneReviewListProps {
  capstoneSubmissionId: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

interface ReviewItemProps {
  review: CapstoneReview;
  capstoneSubmissionId: string;
  isReply?: boolean;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onReply?: (reviewId: string) => void;
}

function ReviewItem({
  review,
  capstoneSubmissionId,
  isReply = false,
  onEdit,
  onDelete,
  onReply,
}: ReviewItemProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const { data: repliesData } = useCapstoneReviews(
    {
      capstoneSubmissionId,
      parentReviewId: review.id,
    },
    { enabled: showReplies }
  );

  const isOwner = user?.uid === review.reviewerId;
  const replies = repliesData?.data.reviews || [];
  const hasReplies = review.replyCount > 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={isReply ? 'ml-8 mt-4 border-l-2 border-muted pl-4' : ''}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <Avatar>
                <AvatarFallback>
                  {getInitials(review.reviewerName || 'User')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">
                    {review.reviewerName || 'Anonymous'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                  {isReply && (
                    <span className="text-xs text-muted-foreground">• Reply</span>
                  )}
                </div>

                {/* Rating - only show for top-level reviews */}
                {review.rating && (
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating!
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.feedback}
                </p>

                {/* Highlights and Suggestions - only for top-level reviews */}
                {!isReply && review.highlights && review.highlights.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-1">Highlights:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      {review.highlights.map((highlight, idx) => (
                        <li key={idx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!isReply && review.suggestions && review.suggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold mb-1">Suggestions:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                      {review.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.updatedAt &&
                  new Date(review.updatedAt).getTime() >
                    new Date(review.createdAt).getTime() && (
                    <p className="text-xs text-muted-foreground mt-2">
                      (edited)
                    </p>
                  )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="mt-4">
                    <ReviewImageManager
                      reviewId={review.id}
                      images={review.images}
                      canEdit={isOwner}
                    />
                  </div>
                )}

                {/* Reply button and reply count */}
                {!isReply && (
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowReplyForm(!showReplyForm);
                        if (!showReplies && hasReplies) {
                          setShowReplies(true);
                        }
                      }}
                      className="h-8 text-xs"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                    {hasReplies && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReplies(!showReplies)}
                        className="h-8 text-xs"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {showReplies
                          ? `Hide ${review.replyCount} ${
                              review.replyCount === 1 ? 'reply' : 'replies'
                            }`
                          : `Show ${review.replyCount} ${
                              review.replyCount === 1 ? 'reply' : 'replies'
                            }`}
                      </Button>
                    )}
                  </div>
                )}

                {/* Reply form */}
                {showReplyForm && !isReply && (
                  <div className="mt-4 pt-4 border-t">
                    <CapstoneReviewForm
                      capstoneSubmissionId={capstoneSubmissionId}
                      review={{
                        ...review,
                        parentReviewId: review.id,
                      }}
                      onSuccess={() => {
                        setShowReplyForm(false);
                        setShowReplies(true);
                      }}
                    />
                  </div>
                )}

                {/* Replies */}
                {showReplies && !isReply && replies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {replies.map((reply) => (
                      <ReviewItem
                        key={reply.id}
                        review={reply}
                        capstoneSubmissionId={capstoneSubmissionId}
                        isReply={true}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {isOwner && (onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(review.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(review.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CapstoneReviewList({
  capstoneSubmissionId,
  onEdit,
  onDelete,
}: CapstoneReviewListProps) {
  const { data, isLoading, error } = useCapstoneReviews({
    capstoneSubmissionId,
    parentReviewId: null, // Only get top-level reviews
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'Failed to load reviews'}
        </AlertDescription>
      </Alert>
    );
  }

  const reviews = data?.data.reviews || [];

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No reviews yet</p>
        <p className="text-sm text-muted-foreground">
          Be the first to review this project!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Reviews & Discussion ({data?.data.total || 0})
      </h3>

      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          capstoneSubmissionId={capstoneSubmissionId}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
