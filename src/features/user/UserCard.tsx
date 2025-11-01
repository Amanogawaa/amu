'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserCircleIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
} from 'lucide-react';

interface UserProfileCardProps {
  userProfile: UserProfile;
  userMe: UserMeResponse;
}

export function UserProfileCard({ userProfile, userMe }: UserProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircleIcon className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {userProfile.user.first_name} {userProfile.user.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {userProfile.user.username}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                userMe.role === 'superadmin'
                  ? 'destructive'
                  : userMe.role === 'admin'
                  ? 'default'
                  : 'secondary'
              }
            >
              <Shield className="h-3 w-3 mr-1" />
              {userMe.role}
            </Badge>
            {userProfile.is_blocked && (
              <Badge variant="destructive">
                <Ban className="h-3 w-3 mr-1" />
                Blocked
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {userProfile.user.email}
              </p>
            </div>
          </div>

          {userProfile.phone_number && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {userProfile.phone_number}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member since</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(userProfile.user.date_joined)}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">ID</p>
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm">{userProfile.user.id}</p>
            </div>
            <div>
              <p
                className={`text-2xl font-bold ${
                  userProfile.is_blocked ? 'text-red-500' : 'text-primary'
                }`}
              >
                {userProfile.is_blocked ? '✗' : '✓'}
              </p>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-sm">
                {userProfile.is_blocked ? 'Blocked' : 'Active'}
              </p>
            </div>
          </div>

          {userProfile.is_blocked && userProfile.blocked_at && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Account Blocked
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Blocked on {formatDate(userProfile.blocked_at)}
                {userProfile.blocked_by_email &&
                  ` by ${userProfile.blocked_by_email}`}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
