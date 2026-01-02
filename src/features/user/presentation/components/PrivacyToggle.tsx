"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Lock, Eye, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  useUpdateUserProfile,
  useUserProfile,
} from "../../application/useUser";
import { ModeToggle } from "@/components/ThemeToggle";

interface PrivacyToggleProps {
  isPrivate?: boolean;
  className?: string;
}

export function PrivacyToggle({
  isPrivate = false,
  className = "",
}: PrivacyToggleProps) {
  const [privateMode, setPrivateMode] = React.useState(isPrivate);
  const updateProfile = useUpdateUserProfile();

  console.log(privateMode);

  const handleToggle = async (checked: boolean) => {
    setPrivateMode(checked);

    try {
      await updateProfile.mutateAsync({
        isPrivate: checked,
      });
      toast.success(
        checked ? "Your profile is now private" : "Your profile is now public"
      );
    } catch (error) {
      setPrivateMode(!checked);
    }
  };

  React.useEffect(() => {
    setPrivateMode(isPrivate);
  }, [isPrivate]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Privacy Settings
        </CardTitle>
        <CardDescription>
          Control who can view your profile and activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Toggle Control */}
        <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`mt-1 p-2 rounded-md ${
                privateMode ? "bg-primary/10" : "bg-muted"
              }`}
            >
              {privateMode ? (
                <Lock className="h-4 w-4 text-primary" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <Label
                htmlFor="private-mode"
                className="text-base font-semibold cursor-pointer"
              >
                Private Account
              </Label>
              <p className="text-sm text-muted-foreground">
                {privateMode
                  ? "Your profile is hidden from other users"
                  : "Your profile is visible to all logged-in users"}
              </p>
            </div>
          </div>
          <Switch
            id="private-mode"
            checked={privateMode}
            onCheckedChange={handleToggle}
            disabled={updateProfile.isPending}
          />
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {privateMode ? (
              <div className="space-y-2">
                <p className="font-semibold">When your account is private:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Other users cannot view your profile</li>
                  <li>Your courses and analytics remain hidden</li>
                  <li>Only you can see your full profile information</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold">When your account is public:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Logged-in users can view your profile</li>
                  <li>Your published courses are visible</li>
                  <li>Your analytics and achievements are shown</li>
                  <li>Your email address remains hidden</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              privateMode ? "bg-amber-500" : "bg-green-500"
            }`}
          />
          <span className="text-muted-foreground">
            Profile visibility:{" "}
            <span className="font-semibold text-foreground">
              {privateMode ? "Private" : "Public"}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
export const SettingsPage = () => {
  const { data: userProfile } = useUserProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account privacy and preferences
        </p>
      </div>

      <div className="w-full space-y-3">
        <PrivacyToggle isPrivate={userProfile?.isPrivate} />
        <ModeToggle />
      </div>
    </div>
  );
};
