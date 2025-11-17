'use client';

import { useAuth } from '@/features/auth/application/AuthContext';
import { GithubIcon } from 'lucide-react';

export function GitHubConnectButton() {
  const { user, githubLinked, linkGithub, unlinkGithub, error } = useAuth();

  if (!user) return null;

  if (githubLinked) {
    const githubData = user.providerData.find(
      (p) => p.providerId === 'github.com'
    );

    return (
      <div>
        <p>Connected as: {githubData?.displayName || githubData?.email}</p>
        <button onClick={unlinkGithub}>Disconnect GitHub</button>
      </div>
    );
  }

  return (
    <button onClick={linkGithub}>
      <GithubIcon /> Connect GitHub
    </button>
  );
}
