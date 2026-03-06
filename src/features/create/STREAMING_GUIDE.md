# Streaming Course Generation

## Overview

The streaming course generation feature allows users to see real-time AI output as the course is being generated, similar to ChatGPT. This provides a better user experience by showing progress instead of just a loading spinner.

## How It Works

### Backend (Already Implemented)

1. **Endpoint**: `POST /courses/stream`
2. **Controller**: [controller.ts](../../../amu-api/src/features/course/controller.ts#L120)
3. **Service**: [service.ts](../../../amu-api/src/features/course/service.ts#L106)
4. **Socket Events**:
   - `course:stream:start` - Emitted when streaming begins
   - `course:stream` - Emits each text chunk as it's generated
   - `course:stream:complete` - Emitted when generation is complete
   - `course:stream:error` - Emitted if an error occurs

### Frontend Components

#### 1. API Client Function

```typescript
import { generateCourseStream } from "@/server/features/course";

const response = await generateCourseStream({
  topic: "React Hooks",
  category: "Programming",
  level: "intermediate",
  duration: "4 hours",
  noOfChapters: 5,
  language: "English",
});
```

Location: [course/index.ts](../server/features/course/index.ts#L147)

#### 2. Hook for Easy Usage

```typescript
import { useStreamingGeneration } from "@/features/create/application";

const { generateWithStreaming, isLoading } = useStreamingGeneration();

await generateWithStreaming({
  topic: "React Hooks",
  // ... other fields
});
```

Location: [useStreamingGeneration.tsx](./application/useStreamingGeneration.tsx)

#### 3. Streaming Window Component

The `StreamingResponseWindow` component automatically:

- Shows in bottom-left corner
- Displays real-time text as it streams
- Auto-scrolls as content appears
- Can be minimized during generation
- Shows completion/error messages

Location: [StreamingResponseWindow.tsx](./presentation/StreamingResponseWindow.tsx)

#### 4. Generation Context

Manages the streaming window visibility and state across the app.

Location: [GenerationContext.tsx](./context/GenerationContext.tsx)

## Usage Example

### Basic Usage

```tsx
import { useStreamingGeneration } from "@/features/create/application";

function MyComponent() {
  const { generateWithStreaming, isLoading } = useStreamingGeneration();

  const handleGenerate = async () => {
    try {
      const course = await generateWithStreaming({
        topic: "TypeScript Advanced Patterns",
        category: "Programming",
        level: "advanced",
        duration: "6 hours",
        noOfChapters: 8,
        language: "English",
      });

      console.log("Generated course:", course);
      // Navigate to course or show success message
    } catch (error) {
      console.error("Generation failed:", error);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate Course"}
    </button>
  );
}
```

### With Form

See the full example in [StreamingCourseExample.tsx](./presentation/StreamingCourseExample.tsx)

## Socket.IO Events Flow

1. User clicks "Generate Course"
2. Frontend calls `generateCourseStream(payload)`
3. Backend starts generation
4. Backend emits `course:stream:start` → StreamingWindow shows
5. As AI generates text, backend emits `course:stream` with each chunk
6. StreamingWindow displays chunks in real-time
7. When complete, backend emits `course:stream:complete`
8. Frontend receives final course data and can navigate/display

## Key Features

- ✅ Real-time text streaming (like ChatGPT)
- ✅ Auto-scrolling content window
- ✅ Minimize/maximize capability
- ✅ Error handling with socket events
- ✅ Toast notifications for success/failure
- ✅ Works across multiple tabs (user-based socket rooms)

## Architecture

```
User Action
    ↓
useStreamingGeneration hook
    ↓
generateCourseStream() API call
    ↓
POST /courses/stream endpoint
    ↓
Course Service (with streaming)
    ↓
Gemini AI (stream: true)
    ↓
Socket.IO events to user room
    ↓
StreamingResponseWindow (displays chunks)
    ↓
Course created & saved to DB
    ↓
Final response returned to frontend
```

## Notes

- Streaming uses Socket.IO events, not HTTP streaming
- Each user has a dedicated room: `user:${userId}`
- The streaming window is managed by GenerationContext
- Add `<FloatingGenerationWidget />` to your layout to show the streaming window
- The window automatically appears when streaming starts
