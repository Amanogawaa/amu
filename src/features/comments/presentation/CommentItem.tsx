'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useDeleteComment, useReplies } from '../application/useComments';
import type { Comment } from '@/server/features/comments/types';
import { MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CommentForm } from './CommentForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommentItemProps {
  comment: Comment;
  courseId: string;
  onReplySuccess?: () => void;
}

export function CommentItem({
  comment,
  courseId,
  onReplySuccess,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const deleteComment = useDeleteComment(courseId);
  const { data: replies } = useReplies(comment.id);

  const isAuthor = user?.uid === comment.authorId;
  const repliesCount = replies?.length || 0;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment.mutate(comment.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {comment.authorName || 'Anonymous'}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-muted-foreground">(edited)</span>
            )}
          </div>
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center gap-4 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs h-7"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Reply
            </Button>

            {repliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs h-7"
              >
                {showReplies ? 'Hide' : 'Show'} {repliesCount}{' '}
                {repliesCount === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>
        </div>

        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-4 ml-4 pl-4 border-l-2">
          <CommentForm
            courseId={courseId}
            parentId={comment.id}
            placeholder="Write a reply..."
            autoFocus
            onSuccess={() => {
              setShowReplyForm(false);
              setShowReplies(true);
              onReplySuccess?.();
            }}
          />
        </div>
      )}

      {showReplies && replies && replies.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 space-y-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} courseId={courseId} />
          ))}
        </div>
      )}
    </Card>
  );
}
