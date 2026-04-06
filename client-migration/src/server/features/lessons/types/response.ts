export interface LessonResource {
  title: string;
  url: string;
  type: "documentation" | "article" | "tool" | "github" | "reference";
  description: string;
}

export interface PlaygroundEnvironment {
  type: "vanilla" | "frontend" | "backend" | "none";
  framework?: string | null;
  dependencies?: string[];
  supportsExecution: boolean;
  executionEngine?: "piston" | "judge0" | "sandpack" | null;
  config?: {
    starterCode?: string;
    files?: Record<string, string>;
    buildCommand?: string;
    runCommand?: string;
  };
}

export interface Lesson {
  id: string;
  chapterId: string;
  lessonOrder: number;
  lessonName: string;
  type: "video" | "article" | "quiz" | "exercise";
  duration: string;
  lessonDescription: string;
  content: string | null;
  videoSearchQuery: string | null;
  resources: LessonResource[];
  selectedVideoId: string;
  learningOutcome: string;
  prerequisites: string[];
  playgroundEnvironment?: PlaygroundEnvironment;
  createdAt?: string;
  updatedAt?: string;
}
