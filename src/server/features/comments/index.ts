import apiRequest from '@/server/helpers/apiRequest';
import type {
  CreateCommentPayload,
  UpdateCommentPayload,
  CommentResponse,
  CommentsListResponse,
  MyCommentsResponse,
  RepliesResponse,
} from './types';

export async function createComment(
  payload: CreateCommentPayload
): Promise<CommentResponse> {
  return apiRequest<CreateCommentPayload, CommentResponse>(
    `/courses/${payload.courseId}/comments`,
    'post',
    payload
  );
}

export async function getCommentsForCourse(
  courseId: string,
  limit = 20,
  offset = 0,
  parentId?: string | null
): Promise<CommentsListResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (parentId !== undefined) {
    params.append('parentId', parentId || 'null');
  }

  return apiRequest<null, CommentsListResponse>(
    `/courses/${courseId}/comments?${params.toString()}`,
    'get'
  );
}

export async function getCommentById(
  commentId: string
): Promise<CommentResponse> {
  return apiRequest<null, CommentResponse>(`/comments/${commentId}`, 'get');
}

export async function updateComment(
  commentId: string,
  payload: UpdateCommentPayload
): Promise<CommentResponse> {
  return apiRequest<UpdateCommentPayload, CommentResponse>(
    `/comments/${commentId}`,
    'patch',
    payload
  );
}

export async function deleteComment(commentId: string): Promise<void> {
  return apiRequest<null, void>(`/comments/${commentId}`, 'delete');
}

export async function getMyComments(): Promise<MyCommentsResponse> {
  return apiRequest<null, MyCommentsResponse>('/comments/me', 'get');
}

export async function getReplies(commentId: string): Promise<RepliesResponse> {
  return apiRequest<null, RepliesResponse>(
    `/comments/${commentId}/replies`,
    'get'
  );
}
