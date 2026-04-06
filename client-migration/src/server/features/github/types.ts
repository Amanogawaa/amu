// GitHub Repository Viewer Types

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file';
  content: string; // Base64 encoded
  encoding: 'base64';
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export interface GitHubFileContentDecoded {
  content: string;
  encoding: string;
  size: number;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
}

export interface GitHubRepoViewerParams {
  owner: string;
  repo: string;
  path?: string;
  ref?: string; // branch, tag, or commit SHA
}

