import { queryKeys } from '@/lib/queryKeys';
import { showErrorToast } from '@/lib/errorHandling';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/application/AuthContext';
import type { UpdateUserProfile } from '../domain/types';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getUserAnalytics,
  getPublicProfiles,
  getPublicUserAnalytics,
} from '@/server/features/user';
import { toast } from 'sonner';

export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: async () => {
      return await getProfile();
    },
  });
};

export const usePublicProfile = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.user.publicProfile(userId),
    queryFn: async () => {
      return await getPublicProfiles(userId);
    },
  });
};

export const useUserAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.user.analytics(),
    queryFn: async () => {
      return await getUserAnalytics();
    },
  });
};

export const usePublicUserAnalytics = (userId: string) => {
  return useQuery({
    queryKey: [...queryKeys.user.analytics(), 'public', userId],
    queryFn: async () => {
      return await getPublicUserAnalytics(userId);
    },
    enabled: !!userId,
  });
};

export const useUpdateUserProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateUserProfile) => {
      return await updateProfile(updates);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      user?.reload();
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to update profile');
    },
  });
};

export const useUploadProfilePicture = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('User not authenticated');
      return await uploadProfilePicture(file);
    },
    onSuccess: () => {
      toast.success('Profile picture updated!');
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      user?.reload();
    },
    onError: (error) => {
      showErrorToast(error, 'Failed to upload profile picture');
    },
  });
};
