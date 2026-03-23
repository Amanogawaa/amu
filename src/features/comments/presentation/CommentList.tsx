"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useCommentsForCourse } from "../application/useComments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";
import { MessageCircle, Zap } from "lucide-react";
import { useState } from "react";

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
      <Card className="border-red-200/50 bg-red-50/30">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-red-600">
            Failed to load comments. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  const comments = commentsData?.comments || [];
  const total = commentsData?.total || 0;
  const hasMore = offset + comments.length < total;
  const hasComments = comments.length > 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="border-0 shadow-none">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Discussion
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {total === 0
                  ? "Be the first to share"
                  : `${total} ${total === 1 ? "comment" : "comments"}`}
              </p>
            </div>
          </div>

          {/* Comment Form - Always visible when there are comments or form is open */}
          {(hasComments || showCommentForm) && (
            <div className="mt-4" data-comment-form>
              <CommentForm courseId={courseId} />
            </div>
          )}
        </div>

        {/* Comments or Empty State */}
        <div className="space-y-4">
          {isLoading ? (
            <>
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-muted bg-muted/30"
                >
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : comments.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="inline-flex p-4 bg-primary/5 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary/40" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Start the Conversation
              </h4>
              <p className="text-sm text-muted-foreground mb-6">
                Share your thoughts, ask questions, or help fellow learners
                grow. Be the first to jump in!
              </p>
              <Button
                onClick={() => setShowCommentForm(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Share Your Thoughts
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    courseId={courseId}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={isLoading}
                    size="sm"
                    className="text-xs"
                  >
                    Load More Comments
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
