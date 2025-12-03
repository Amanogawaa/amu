import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { GitHubConnectButton } from '@/features/auth/presentation/GithubButton';
import type { User } from 'firebase/auth';
import { ProfilePictureSelector } from './ProfilePictureSelector';
import { PrivacyToggle } from './PrivacyToggle';
import { UserProfile } from '../../domain/types';

interface ProfileHeaderProps {
  user: User | null;
  userProfile: UserProfile | undefined;
  isPublicView?: boolean;
}

export function ProfileHeader({
  user,
  userProfile,
  isPublicView = false,
}: ProfileHeaderProps) {
  return (
    <Card className="mt-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar className="h-32 w-32 border-4 border-primary/20">
              <AvatarImage
                src={userProfile?.photoURL || user?.photoURL || '/profile_1'}
                alt={
                  userProfile?.firstName || user?.displayName || 'User profile'
                }
              />
              <AvatarFallback className="text-3xl">
                {userProfile?.email?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  'U'}
              </AvatarFallback>
            </Avatar>
            {/* Only show profile picture selector if it's not a public view */}
            {!isPublicView && (
              <ProfilePictureSelector currentPhotoURL={user?.photoURL} />
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                {userProfile?.firstName || userProfile?.lastName
                  ? `${userProfile.firstName || ''} ${
                      userProfile.lastName || ''
                    }`.trim()
                  : user?.displayName || user?.uid || 'Anonymous User'}
              </h2>
              {/* Only show email if it's not a public view */}
              {!isPublicView && (
                <p className="text-muted-foreground mt-1">
                  {user?.email || userProfile?.email}
                </p>
              )}
            </div>

            {/* GitHub Connect Button - only show on own profile */}
            {!isPublicView && (
              <>
                <div className="flex justify-center md:justify-start">
                  <GitHubConnectButton />
                </div>
                <PrivacyToggle isPrivate={userProfile?.isPrivate} />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
