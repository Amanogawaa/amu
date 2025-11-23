'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import { GithubIcon, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function GitHubConnectButton() {
  const { user, githubLinked, linkGithub, unlinkGithub, error } = useAuth();

  if (!user) return null;

  if (githubLinked) {
    const githubData = user.providerData.find(
      (p) => p.providerId === 'github.com'
    );

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
          <GithubIcon className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            {githubData?.displayName || githubData?.email || 'Connected'}
          </span>
          <Check className="h-4 w-4 text-green-600" />
        </div>
        <Button
          onClick={unlinkGithub}
          variant="ghost"
          size="sm"
          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-500/10"
        >
          <X className="h-4 w-4 mr-1" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={linkGithub} variant="outline" size="sm" className="gap-2">
      <GithubIcon className="h-4 w-4" />
      Connect GitHub
    </Button>
  );
}
