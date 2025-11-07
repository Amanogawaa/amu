import apiRequest from '@/server/helpers/apiRequest';
import { UserProfile } from './types';

export async function getProfile(): Promise<UserProfile> {
  return apiRequest<null, UserProfile>('/user/profile', 'get');
}
