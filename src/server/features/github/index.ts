import apiRequest from '@/server/helpers/apiRequest';
import type {
  GitHubTreeResponse,
  GitHubFileContent,
  GitHubFileContentDecoded,
  GitHubBranch,
  GitHubRepoViewerParams,
} from './types';

/**
 * Get repository tree structure
 */
export async function getGitHubRepoTree(
  owner: string,
  repo: string,
  ref?: string
): Promise<GitHubTreeResponse> {
  const params = new URLSearchParams();
  if (ref) params.append('ref', ref);

  const queryString = params.toString();
  const url = `/github/repos/${owner}/${repo}/tree${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<null, { data: GitHubTreeResponse; message: string }>(
    url,
    'get'
  );

  return response.data;
}

/**
 * Get repository contents (file or directory)
 */
export async function getGitHubRepoContents(
  owner: string,
  repo: string,
  path?: string,
  ref?: string
): Promise<GitHubFileContent | GitHubFileContent[]> {
  const params = new URLSearchParams();
  if (path) params.append('path', path);
  if (ref) params.append('ref', ref);

  const queryString = params.toString();
  const url = `/github/repos/${owner}/${repo}/contents${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<
    null,
    { data: GitHubFileContent | GitHubFileContent[]; message: string }
  >(url, 'get');

  return response.data;
}

/**
 * Get file content (decoded)
 */
export async function getGitHubFileContent(
  owner: string,
  repo: string,
  path: string,
  ref?: string
): Promise<GitHubFileContentDecoded> {
  const params = new URLSearchParams();
  if (ref) params.append('ref', ref);

  params.append('path', path);
  const queryString = params.toString();
  const url = `/github/repos/${owner}/${repo}/file${queryString ? `?${queryString}` : ''}`;

  const response = await apiRequest<
    null,
    { data: GitHubFileContentDecoded; message: string }
  >(url, 'get');

  return response.data;
}

/**
 * Get repository branches
 */
export async function getGitHubBranches(
  owner: string,
  repo: string
): Promise<GitHubBranch[]> {
  const url = `/github/repos/${owner}/${repo}/branches`;

  const response = await apiRequest<null, { data: GitHubBranch[]; message: string }>(
    url,
    'get'
  );

  return response.data;
}

