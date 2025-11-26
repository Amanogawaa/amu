'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { GitHubTreeItem } from '@/server/features/github/types';
import { cn } from '@/lib/utils';

interface TreeNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  size?: number;
  children?: TreeNode[];
  expanded?: boolean;
}

interface GitHubFileTreeProps {
  tree: GitHubTreeItem[];
  onFileSelect: (path: string) => void;
  selectedPath?: string;
  className?: string;
}

export function GitHubFileTree({
  tree,
  onFileSelect,
  selectedPath,
  className,
}: GitHubFileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  // Build tree structure from flat list
  const treeStructure = useMemo(() => {
    const root: TreeNode[] = [];
    const pathMap = new Map<string, TreeNode>();

    // Sort tree items: folders first, then files
    const sortedTree = [...tree].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'tree' ? -1 : 1;
      }
      return a.path.localeCompare(b.path);
    });

    sortedTree.forEach((item) => {
      const parts = item.path.split('/');
      const name = parts[parts.length - 1];
      const node: TreeNode = {
        name,
        path: item.path,
        type: item.type,
        size: item.size,
        children: item.type === 'tree' ? [] : undefined,
      };

      if (parts.length === 1) {
        // Root level
        root.push(node);
      } else {
        // Nested - find parent
        const parentPath = parts.slice(0, -1).join('/');
        const parent = pathMap.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(node);
        }
      }

      pathMap.set(item.path, node);
    });

    return root;
  }, [tree]);

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const isExpanded = (path: string) => expandedPaths.has(path);

  const renderNode = (node: TreeNode, level: number = 0): React.ReactNode => {
    const isFolder = node.type === 'tree';
    const expanded = isExpanded(node.path);
    const isSelected = selectedPath === node.path;

    return (
      <div key={node.path}>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted/50 transition-colors',
            isSelected && 'bg-muted',
            level > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${level * 1.25 + 0.5}rem` }}
          onClick={() => {
            if (isFolder) {
              toggleExpand(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {isFolder ? (
            <>
              {expanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              {expanded ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-5" /> {/* Spacer for alignment */}
              <File className="h-4 w-4 text-muted-foreground" />
            </>
          )}
          <span className="text-sm flex-1 truncate">{node.name}</span>
          {!isFolder && node.size !== undefined && (
            <span className="text-xs text-muted-foreground">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
        {isFolder && expanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-2 space-y-1">
        {treeStructure.length === 0 ? (
          <div className="text-sm text-muted-foreground p-4 text-center">
            No files found
          </div>
        ) : (
          treeStructure.map((node) => renderNode(node))
        )}
      </div>
    </ScrollArea>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

