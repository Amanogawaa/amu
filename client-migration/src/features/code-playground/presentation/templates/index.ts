export * from "./react-template";
export * from "./vue-template";
export * from "./angular-template";
export * from "./django-template";
export * from "./fastapi-template";
export * from "./express-template";

export type FrameworkType =
  | "react"
  | "vue"
  | "angular"
  | "django"
  | "fastapi"
  | "express"
  | "vanilla";

export function getFileExtension(framework: string): string {
  switch (framework.toLowerCase()) {
    case "react":
      return "jsx";
    case "vue":
      return "vue";
    case "angular":
      return "ts";
    case "typescript":
      return "ts";
    case "javascript":
      return "js";
    default:
      return "js";
  }
}

export function getDefaultCode(framework: string): string {
  switch (framework.toLowerCase()) {
    case "react":
      return `export default function App() {
  return <div>Hello React!</div>;
}`;
    case "vue":
      return `<template>
  <div>Hello Vue!</div>
</template>

<script setup>
// Your code here
</script>`;
    case "angular":
      return `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div>Hello Angular!</div>'
})
export class AppComponent {}`;
    default:
      return "// Start coding here";
  }
}
