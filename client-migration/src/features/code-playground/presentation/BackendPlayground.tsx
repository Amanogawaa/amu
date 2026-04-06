"use client";

import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import { FileTree } from "./FileTree";
import { ExternalLink, Play, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PlaygroundEnvironment } from "@/server/features/lessons/types/response";

interface BackendPlaygroundProps {
  environment: PlaygroundEnvironment;
  lessonId?: string;
}

export function BackendPlayground({
  environment,
  lessonId,
}: BackendPlaygroundProps) {
  const { framework, config } = environment;
  const files = config?.files || {};

  const [selectedFile, setSelectedFile] = useState<string>(
    getDefaultFile(files, framework),
  );
  const [openTabs, setOpenTabs] = useState<string[]>([
    getDefaultFile(files, framework),
  ]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    if (!openTabs.includes(filePath)) {
      setOpenTabs([...openTabs, filePath]);
    }
  };

  const handleCloseTab = (filePath: string) => {
    const newTabs = openTabs.filter((tab) => tab !== filePath);
    setOpenTabs(newTabs);
    if (selectedFile === filePath && newTabs.length > 0) {
      setSelectedFile(newTabs[newTabs.length - 1]);
    }
  };

  const getLanguage = (filePath: string): string => {
    const ext = filePath.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      py: "python",
      js: "javascript",
      ts: "typescript",
      json: "json",
      md: "markdown",
      txt: "plaintext",
      html: "html",
      css: "css",
      yaml: "yaml",
      yml: "yaml",
    };
    return langMap[ext || ""] || "plaintext";
  };

  return (
    <div className="backend-playground border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2">
        <div>
          <h4 className="text-sm font-semibold">
            {framework || "Backend"} Project Explorer
          </h4>
          <p className="text-xs text-muted-foreground">
            Read-only project structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => openInReplit(framework, files)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in Replit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => openInCodespaces(framework, files)}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            GitHub Codespaces
          </Button>
        </div>
      </div>

      <div className="flex h-[600px]">
        <div className="w-64 overflow-y-auto border-r">
          <FileTree
            files={files}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
          />
        </div>

        <div className="flex-1 flex flex-col">
          {openTabs.length > 0 && (
            <Tabs
              value={selectedFile}
              onValueChange={setSelectedFile}
              className="flex-1 flex flex-col"
            >
              <TabsList className="w-full justify-start rounded-none border-b bg-muted/30 h-auto p-0">
                {openTabs.map((filePath) => (
                  <TabsTrigger
                    key={filePath}
                    value={filePath}
                    className="rounded-none border-r data-[state=active]:bg-background relative group"
                  >
                    <span className="text-xs truncate max-w-[150px]">
                      {filePath.split("/").pop()}
                    </span>
                    {openTabs.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCloseTab(filePath);
                        }}
                        className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-muted rounded p-0.5"
                      >
                        ×
                      </button>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {openTabs.map((filePath) => (
                <TabsContent
                  key={filePath}
                  value={filePath}
                  className="flex-1 m-0 data-[state=active]:flex"
                >
                  <Editor
                    height="100%"
                    language={getLanguage(filePath)}
                    value={files[filePath] || ""}
                    theme="vs-dark"
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      folding: true,
                      renderLineHighlight: "all",
                      automaticLayout: true,
                    }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}

          {openTabs.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">Select a file to view</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-muted/30 px-4 py-3">
        <div className="flex items-start gap-3">
          <Play className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">Ready to run this code?</p>
            <p className="text-muted-foreground text-xs">
              Click "Open in Replit" or "GitHub Codespaces" to run this{" "}
              {framework || "backend"} project in a full development
              environment. Full execution support coming in future updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDefaultFile(
  files: Record<string, string>,
  framework?: string | null,
): string {
  const fileKeys = Object.keys(files);
  if (fileKeys.length === 0) return "/";

  const defaults: Record<string, string[]> = {
    django: ["/main.py", "/myapp/views.py", "/manage.py"],
    fastapi: ["/main.py", "/routers/items.py"],
    express: ["/server.js", "/routes/items.js"],
  };

  const frameworkDefaults = defaults[framework?.toLowerCase() || ""] || [];

  for (const defaultFile of frameworkDefaults) {
    if (fileKeys.includes(defaultFile)) {
      return defaultFile;
    }
  }

  return fileKeys[0];
}

function openInReplit(
  framework: string | null | undefined,
  files: Record<string, string>,
) {
  const language =
    framework?.toLowerCase() === "django" ||
    framework?.toLowerCase() === "fastapi"
      ? "python3"
      : "nodejs";
  const url = `https://replit.com/new/${language}`;
  window.open(url, "_blank");
}

function openInCodespaces(
  framework: string | null | undefined,
  files: Record<string, string>,
) {
  const url = `https://github.com/codespaces/new`;
  window.open(url, "_blank");
}
