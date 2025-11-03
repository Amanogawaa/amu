'use client';

import { Button } from '@/components/ui/button';
import { useCreateComment } from '../application/useComments';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  courseId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  courseId,
  parentId,
  onSuccess,
  placeholder = 'Write a comment...',
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const createComment = useCreateComment(courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    createComment.mutate(
      {
        courseId,
        content: content.trim(),
        parentId,
      },
      {
        onSuccess: () => {
          setContent('');
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setContent(e.target.value)
        }
        placeholder={placeholder}
        maxLength={1000}
        rows={3}
        autoFocus={autoFocus}
        className="resize-none"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/1000
        </span>
        <Button
          type="submit"
          disabled={!content.trim() || createComment.isPending}
          size="sm"
        >
          {createComment.isPending
            ? 'Posting...'
            : parentId
            ? 'Reply'
            : 'Comment'}
        </Button>
      </div>
    </form>
  );
}
