'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Github,
  ExternalLink,
  Heart,
  MessageSquare,
  Star,
  MoreVertical,
  Edit,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToggleCapstoneLike } from '../../application/useToggleCapstoneLike';
import { useGetCapstoneLikeStatus } from '../../application/useGetCapstoneLikeStatus';
import { useAuth } from '@/features/auth/application/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { CapstoneSubmission } from '@/server/features/capstone/types';

interface CapstoneSubmissionCardProps {
  submission: CapstoneSubmission;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function CapstoneSubmissionCard({
  submission,
  onEdit,
  onDelete,
  showActions = false,
}: CapstoneSubmissionCardProps) {
  const { user } = useAuth();
  const toggleLike = useToggleCapstoneLike();
  const { data: likeStatus } = useGetCapstoneLikeStatus(submission.id);

  const isOwner = user?.uid === submission.userId;
  const isLiked = likeStatus?.data?.liked || false;
  const likesCount = submission.likeCount || 0;
  const reviewsCount = submission.reviewCount || 0;

  const handleLike = () => {
    toggleLike.mutate(submission.id);
  };

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

  return (
    <Card className="group h-full flex flex-col transition-all duration-300 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={`/capstone/submissions/${submission.id}`}>
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {submission.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials('User')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {submission.userId}
              </span>
              <span className="text-xs text-muted-foreground">
                • {formatDate(submission.submittedAt)}
              </span>
            </div>
          </div>

          {showActions && isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={onDelete}
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
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {submission.description}
        </p>

        {/* GitHub Stats */}
        {submission.repoMetadata && (
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {submission.repoMetadata.stars} stars
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {submission.repoMetadata.language || 'N/A'}
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? 'default' : 'ghost'}
            size="sm"
            onClick={handleLike}
            disabled={toggleLike.isPending}
            className="gap-1"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all',
                isLiked && 'fill-current'
              )}
            />
            <span className="text-xs">{likesCount}</span>
          </Button>

          <Link href={`/capstone/submissions/${submission.id}#reviews`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{reviewsCount}</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={submission.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-1" />
              Code
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
