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
import { Star, MoreVertical, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Empty } from '@/components/ui/empty';

interface CapstoneReviewListProps {
  capstoneSubmissionId: string;
  onEdit?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
}

export function CapstoneReviewList({
  capstoneSubmissionId,
  onEdit,
  onDelete,
}: CapstoneReviewListProps) {
  const { user } = useAuth();
  const { data, isLoading, error } = useCapstoneReviews({
    capstoneSubmissionId,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
        Reviews ({data?.data.total || 0})
      </h3>

      {reviews.map((review) => {
        const isOwner = user?.uid === review.reviewerId;

        return (
          <Card key={review.id}>
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
                    </div>

                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {review.feedback}
                    </p>

                    {review.updatedAt &&
                      new Date(review.updatedAt).getTime() >
                        new Date(review.createdAt).getTime() && (
                        <p className="text-xs text-muted-foreground mt-2">
                          (edited)
                        </p>
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
        );
      })}
    </div>
  );
}
