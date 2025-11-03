import apiRequest from '@/server/helpers/apiRequest';
import type {
  LikeStatusResponse,
  LikesListResponse,
  MyLikesResponse,
} from './types';

export async function toggleLike(
  courseId: string
): Promise<LikeStatusResponse> {
  return apiRequest<null, LikeStatusResponse>(
    `/courses/${courseId}/like`,
    'post'
  );
}

export async function getLikeStatus(
  courseId: string
): Promise<LikeStatusResponse> {
  return apiRequest<null, LikeStatusResponse>(
    `/courses/${courseId}/like/status`,
    'get'
  );
}

export async function getLikesForCourse(
  courseId: string,
  limit = 50,
  offset = 0
): Promise<LikesListResponse> {
  return apiRequest<null, LikesListResponse>(
    `/courses/${courseId}/likes?limit=${limit}&offset=${offset}`,
    'get'
  );
}

export async function getMyLikes(): Promise<MyLikesResponse> {
  return apiRequest<null, MyLikesResponse>('/likes/me', 'get');
}
