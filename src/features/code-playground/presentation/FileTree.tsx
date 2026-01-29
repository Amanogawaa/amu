"use client";

import { useState } from "react";
import {
  FileText,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileTreeProps {
  files: Record<string, string>;
  selectedFile: string;
  onFileSelect: (path: string) => void;
}

export function FileTree({ files, selectedFile, onFileSelect }: FileTreeProps) {
  const fileTree = buildFileTree(files);

  return (
    <div className="file-tree border-r bg-muted/30 p-2">
      <div className="mb-2 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase">
        Project Files
      </div>
      <TreeNode
        node={fileTree}
        level={0}
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
      />
    </div>
  );
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedFile: string;
  onFileSelect: (path: string) => void;
}

function TreeNode({ node, level, selectedFile, onFileSelect }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedFile === node.path;

  if (node.type === "file") {
    return (
      <button
        onClick={() => onFileSelect(node.path)}
        className={cn(
          "flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent",
          isSelected && "bg-accent text-accent-foreground font-medium",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-accent"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpen className="h-4 w-4 flex-shrink-0 text-blue-500" />
        ) : (
          <Folder className="h-4 w-4 flex-shrink-0 text-blue-500" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function buildFileTree(files: Record<string, string>): FileNode {
  const root: FileNode = {
    name: "root",
    path: "/",
    type: "folder",
    children: [],
  };

  Object.keys(files).forEach((filePath) => {
    const parts = filePath.split("/").filter(Boolean);
    let currentNode = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = "/" + parts.slice(0, index + 1).join("/");

      if (!currentNode.children) {
        currentNode.children = [];
      }

      let childNode = currentNode.children.find((child) => child.name === part);

      if (!childNode) {
        childNode = {
          name: part,
          path,
          type: isFile ? "file" : "folder",
          ...(isFile ? {} : { children: [] }),
        };
        currentNode.children.push(childNode);
      }

      if (!isFile) {
        currentNode = childNode;
      }
    });
  });

  const sortChildren = (node: FileNode) => {
    if (node.children) {
      node.children.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      node.children.forEach(sortChildren);
    }
  };

  sortChildren(root);

  return root;
}
