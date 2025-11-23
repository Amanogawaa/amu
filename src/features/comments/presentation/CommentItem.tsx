'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/features/auth/application/AuthContext';
import { useDeleteComment, useReplies } from '../application/useComments';
import type { Comment } from '@/server/features/comments/types';
import { MessageCircle, MoreVertical, Trash2, Reply } from 'lucide-react';
import { useState } from 'react';
import { CommentForm } from './CommentForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

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
    deleteComment.mutate(comment.id);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
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
    <Card className="p-4 hover:border-primary/20 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {getInitials(comment.authorName || 'User')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">
                {comment.authorName || 'Anonymous'}
              </span>
              {isAuthor && (
                <Badge variant="secondary" className="text-xs h-5">
                  You
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
              {comment.createdAt !== comment.updatedAt && (
                <span className="text-xs text-muted-foreground">(edited)</span>
              )}
            </div>

            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
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

          <p className="text-sm whitespace-pre-wrap break-words mb-3">
            {comment.content}
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs h-7 px-2"
            >
              <Reply className="h-3 w-3 mr-1.5" />
              Reply
            </Button>

            {repliesCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs h-7 px-2"
              >
                <MessageCircle className="h-3 w-3 mr-1.5" />
                {showReplies ? 'Hide' : 'Show'} {repliesCount}{' '}
                {repliesCount === 1 ? 'reply' : 'replies'}
              </Button>
            )}
          </div>
        </div>
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
