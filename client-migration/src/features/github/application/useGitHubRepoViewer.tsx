import { useQuery } from '@tanstack/react-query';
import {
  getGitHubRepoTree,
  getGitHubRepoContents,
  getGitHubFileContent,
  getGitHubBranches,
} from '@/server/features/github';
import type {
  GitHubTreeResponse,
  GitHubFileContent,
  GitHubFileContentDecoded,
  GitHubBranch,
} from '@/server/features/github/types';

interface UseGitHubRepoTreeOptions {
  enabled?: boolean;
  ref?: string;
}

export function useGitHubRepoTree(
  owner: string,
  repo: string,
  options?: UseGitHubRepoTreeOptions
) {
  return useQuery<GitHubTreeResponse>({
    queryKey: ['github', 'repo', 'tree', owner, repo, options?.ref],
    queryFn: () => getGitHubRepoTree(owner, repo, options?.ref),
    enabled: options?.enabled !== false && !!owner && !!repo,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

interface UseGitHubRepoContentsOptions {
  enabled?: boolean;
  path?: string;
  ref?: string;
}

export function useGitHubRepoContents(
  owner: string,
  repo: string,
  options?: UseGitHubRepoContentsOptions
) {
  return useQuery<GitHubFileContent | GitHubFileContent[]>({
    queryKey: ['github', 'repo', 'contents', owner, repo, options?.path, options?.ref],
    queryFn: () =>
      getGitHubRepoContents(owner, repo, options?.path, options?.ref),
    enabled: options?.enabled !== false && !!owner && !!repo,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseGitHubFileContentOptions {
  enabled?: boolean;
  ref?: string;
}

export function useGitHubFileContent(
  owner: string,
  repo: string,
  path: string,
  options?: UseGitHubFileContentOptions
) {
  return useQuery<GitHubFileContentDecoded>({
    queryKey: ['github', 'repo', 'file', owner, repo, path, options?.ref],
    queryFn: () => getGitHubFileContent(owner, repo, path, options?.ref),
    enabled: options?.enabled !== false && !!owner && !!repo && !!path,
    staleTime: 5 * 60 * 1000,
  });
}

interface UseGitHubBranchesOptions {
  enabled?: boolean;
}

export function useGitHubBranches(
  owner: string,
  repo: string,
  options?: UseGitHubBranchesOptions
) {
  return useQuery<GitHubBranch[]>({
    queryKey: ['github', 'repo', 'branches', owner, repo],
    queryFn: () => getGitHubBranches(owner, repo),
    enabled: options?.enabled !== false && !!owner && !!repo,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

