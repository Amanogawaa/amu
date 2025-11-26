'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Github,
  ExternalLink,
  AlertCircle,
  Loader2,
  FolderTree,
} from 'lucide-react';
import { GitHubFileTree } from './GitHubFileTree';
import { GitHubCodeViewer, GitHubCodeViewerSkeleton } from './GitHubCodeViewer';
import {
  useGitHubRepoTree,
  useGitHubFileContent,
  useGitHubBranches,
} from '../application/useGitHubRepoViewer';
import { cn } from '@/lib/utils';

interface GitHubRepoViewerProps {
  owner: string;
  repo: string;
  initialPath?: string;
  initialRef?: string;
  className?: string;
}

export function GitHubRepoViewer({
  owner,
  repo,
  initialPath,
  initialRef,
  className,
}: GitHubRepoViewerProps) {
  const [selectedPath, setSelectedPath] = useState<string | undefined>(
    initialPath
  );
  const [selectedRef, setSelectedRef] = useState<string | undefined>(
    initialRef
  );

  const { data: branches, isLoading: branchesLoading } = useGitHubBranches(
    owner,
    repo
  );

  const defaultBranch = branches?.[0]?.name || 'main';
  const currentRef = selectedRef || defaultBranch;

  const { data: tree, isLoading: treeLoading, error: treeError } =
    useGitHubRepoTree(owner, repo, {
      ref: currentRef,
    });

  const {
    data: fileContent,
    isLoading: fileLoading,
    error: fileError,
  } = useGitHubFileContent(owner, repo, selectedPath || '', {
    enabled: !!selectedPath,
    ref: currentRef,
  });

  const handleFileSelect = (path: string) => {
    setSelectedPath(path);
  };

  const githubUrl = `https://github.com/${owner}/${repo}`;
  const fileGithubUrl = selectedPath
    ? `${githubUrl}/blob/${currentRef}/${selectedPath}`
    : undefined;

  if (treeError) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Repository</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {treeError instanceof Error
                ? treeError.message
                : 'Failed to load repository'}
            </p>
            <Button variant="outline" asChild>
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('flex flex-col h-full gap-4', className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5" />
              <div>
                <CardTitle className="text-lg">
                  {owner}/{repo}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            {branches && branches.length > 0 && (
              <Select
                value={currentRef}
                onValueChange={setSelectedRef}
                disabled={branchesLoading}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.name} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* File Tree */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              <CardTitle className="text-sm">Files</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {treeLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : tree ? (
              <GitHubFileTree
                tree={tree.tree}
                onFileSelect={handleFileSelect}
                selectedPath={selectedPath}
                className="h-full"
              />
            ) : null}
          </CardContent>
        </Card>

        {/* Code Viewer */}
        <Card className="lg:col-span-2 flex flex-col min-h-0">
          {fileLoading ? (
            <GitHubCodeViewerSkeleton />
          ) : fileError ? (
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {fileError instanceof Error
                    ? fileError.message
                    : 'Error Loading File'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a file from the tree to view its contents
                </p>
              </div>
            </CardContent>
          ) : fileContent && selectedPath ? (
            <GitHubCodeViewer
              content={fileContent.content}
              path={selectedPath}
              size={fileContent.size}
              githubUrl={fileGithubUrl}
              className="h-full"
            />
          ) : (
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderTree className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  No file selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a file from the tree to view its contents
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

