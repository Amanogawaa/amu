import apiRequest from '@/server/helpers/apiRequest';
import { UserProfile } from './types';
import type { UserAnalytics } from '@/features/user/domain/types';

export async function getProfile(): Promise<UserProfile> {
  return apiRequest<null, UserProfile>('/user/profile', 'get');
}

export async function updateProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  return apiRequest<Partial<UserProfile>, UserProfile>(
    '/user/profile',
    'put',
    updates
  );
}

// not working gonna fix it later
export async function uploadProfilePicture(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiRequest<
    FormData,
    { data: { photoURL: string }; message: string }
  >('/user/profile/picture', 'post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.photoURL;
}

export async function getUserAnalytics(): Promise<UserAnalytics> {
  return apiRequest<null, UserAnalytics>('/user/analytics', 'get');
}
