"use client";

import { Sandpack, SandpackProps } from "@codesandbox/sandpack-react";
import { nightOwl } from "@codesandbox/sandpack-themes";
import type { PlaygroundEnvironment } from "@/server/features/lessons/types/response";
import { getFileExtension, getDefaultCode } from "./templates";

interface SandpackPlaygroundProps {
  environment: PlaygroundEnvironment;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  lessonId?: string;
}

export function SandpackPlayground({
  environment,
  initialCode,
  onCodeChange,
  lessonId,
}: SandpackPlaygroundProps) {
  const { framework = "react", dependencies = [], config } = environment;

  const safeFramework = framework || "react";

  const mainFileName = getMainFileName(safeFramework);
  const fileExtension = getFileExtension(safeFramework);

  const files: Record<string, any> = {};

  files[mainFileName] = {
    code: initialCode || config?.starterCode || getDefaultCode(safeFramework),
  };

  if (config?.files) {
    Object.entries(config.files).forEach(([path, content]) => {
      files[path] = { code: content };
    });
  }

  const customDependencies: Record<string, string> = {};
  dependencies.forEach((dep: string) => {
    if (dep.includes("@")) {
      const [name, version] = dep.split("@");
      customDependencies[name] = version || "latest";
    } else {
      customDependencies[dep] = "latest";
    }
  });

  const template = getSandpackTemplate(safeFramework);

  return (
    <div className="sandpack-playground w-full">
      <Sandpack
        template={template}
        files={files}
        theme={nightOwl}
        options={{
          showNavigator: true,
          showTabs: true,
          showLineNumbers: true,
          showInlineErrors: true,
          wrapContent: true,
          editorHeight: 500,
          autorun: true,
          autoReload: true,
          recompileMode: "delayed",
          recompileDelay: 300,
        }}
        customSetup={{
          dependencies: {
            ...getDefaultDependencies(safeFramework),
            ...customDependencies,
          },
        }}
      />

      {process.env.NODE_ENV === "development" && (
        <div className="mt-2 text-xs text-muted-foreground">
          Framework: {framework} | Template: {template} | Lesson: {lessonId}
        </div>
      )}
    </div>
  );
}

function getMainFileName(framework: string): string {
  switch (framework.toLowerCase()) {
    case "react":
      return "/App.jsx";
    case "vue":
      return "/src/App.vue";
    case "angular":
      return "/src/app/app.component.ts";
    case "svelte":
      return "/App.svelte";
    default:
      return "/App.jsx";
  }
}

function getSandpackTemplate(framework: string): SandpackProps["template"] {
  switch (framework.toLowerCase()) {
    case "react":
      return "react";
    case "vue":
      return "vue";
    case "angular":
      return "angular";
    case "svelte":
      return "svelte";
    case "vanilla":
      return "vanilla";
    default:
      return "react";
  }
}

function getDefaultDependencies(framework: string): Record<string, string> {
  switch (framework.toLowerCase()) {
    case "react":
      return {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
      };
    case "vue":
      return {
        vue: "^3.3.0",
      };
    case "angular":
      return {
        "@angular/core": "^17.0.0",
        "@angular/platform-browser": "^17.0.0",
        "@angular/platform-browser-dynamic": "^17.0.0",
        rxjs: "^7.8.0",
        tslib: "^2.6.0",
        "zone.js": "^0.14.0",
      };
    case "svelte":
      return {
        svelte: "^4.0.0",
      };
    default:
      return {};
  }
}
