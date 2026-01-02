'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import { useUserProfile } from '@/features/user/application/useUser';
import { ProfileHeader } from '@/features/user/presentation/components';
import { UserProfileForm } from '@/features/user/presentation/form';

const AccountPage = () => {
  const { user } = useAuth();
  const { data: userProfile } = useUserProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information
        </p>
      </div>

      <ProfileHeader user={user} userProfile={userProfile} />

      <div className="mt-6">
        <UserProfileForm
          firstName={userProfile?.firstName}
          lastName={userProfile?.lastName}
        />
      </div>
    </div>
  );
};

export default AccountPage;
