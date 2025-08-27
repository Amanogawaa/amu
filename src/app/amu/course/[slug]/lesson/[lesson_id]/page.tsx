"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Play,
  FileText,
  HelpCircle,
  CheckSquare,
  MessageCircle,
  Send,
  X,
} from "lucide-react";

interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  type: string;
  description: string;
  duration: string;
  videoUrl?: string;
  content?: string;
  order: number;
  resources?: LessonResource[];
  completed?: boolean; // Add completion status
}

interface LessonResource {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Course {
  id: string;
  name: string;
  subtitle?: string;
}

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chapterLessons, setChapterLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(-1);
  const [markingComplete, setMarkingComplete] = useState(false);

  // Chat assistant state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);

  // Local completion state - you could move this to localStorage for persistence
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set()
  );

  const params = useParams();
  const router = useRouter();

  // CORRECTED: Use params directly instead of window.location
  const courseId = params.slug as string; // This is the course ID from the URL
  const lessonId = params.lesson_id as string; // This is the lesson ID from the URL

  useEffect(() => {
    async function fetchLessonData() {
      try {
        setLoading(true);

        // Fetch lesson details using the new endpoint
        const lessonResponse = await fetch(`/api/lesson?id=${lessonId}`);
        if (!lessonResponse.ok) {
          throw new Error("Failed to fetch lesson");
        }
        const lessonData = await lessonResponse.json();

        // Check if lesson is already marked as complete
        const isCompleted = completedLessons.has(lessonData.lesson.id);
        setLesson({ ...lessonData.lesson, completed: isCompleted });

        // Fetch chapter details using the lesson's chapterId
        if (lessonData.lesson.chapterId) {
          const chapterResponse = await fetch(
            `/api/chapter?id=${lessonData.lesson.chapterId}`
          );
          if (chapterResponse.ok) {
            const chapterData = await chapterResponse.json();
            setChapter(chapterData.chapter);
          }

          // Fetch all lessons for this chapter
          const lessonsResponse = await fetch(
            `/api/lessons?chapterId=${lessonData.lesson.chapterId}`
          );
          if (lessonsResponse.ok) {
            const lessonsData = await lessonsResponse.json();

            // Mark lessons as completed based on local state
            const lessonsWithCompletion = lessonsData.lessons.map(
              (l: Lesson) => ({
                ...l,
                completed: completedLessons.has(l.id),
              })
            );

            setChapterLessons(lessonsWithCompletion);

            // Find current lesson index
            const index = lessonsWithCompletion.findIndex(
              (l: Lesson) => l.id === lessonId
            );
            setCurrentLessonIndex(index);
          }
        }

        // Fetch course details
        const courseResponse = await fetch(`/api/course?id=${courseId}`);
        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourse(courseData.course);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }

    if (lessonId && courseId) {
      fetchLessonData();
    }
  }, [lessonId, courseId, completedLessons]);

  const handleBackToCourse = () => {
    router.push(`/amu/course/${courseId}`);
  };

  const handleNextLesson = () => {
    if (
      currentLessonIndex >= 0 &&
      currentLessonIndex < chapterLessons.length - 1
    ) {
      const nextLesson = chapterLessons[currentLessonIndex + 1];
      router.push(`/amu/course/${courseId}/lesson/${nextLesson.id}`);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const previousLesson = chapterLessons[currentLessonIndex - 1];
      router.push(`/amu/course/${courseId}/lesson/${previousLesson.id}`);
    }
  };

  const handleMarkComplete = async () => {
    if (!lesson || markingComplete) return;

    setMarkingComplete(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Update local state
      setCompletedLessons((prev) => new Set([...prev, lesson.id]));

      // Update lesson state
      setLesson((prev) => (prev ? { ...prev, completed: true } : null));

      // Update in chapter lessons array
      setChapterLessons((prev) =>
        prev.map((l) => (l.id === lesson.id ? { ...l, completed: true } : l))
      );

      // Optional: Save to localStorage for persistence across page refreshes
      const stored = JSON.parse(
        localStorage.getItem("completedLessons") || "[]"
      );
      localStorage.setItem(
        "completedLessons",
        JSON.stringify([...stored, lesson.id])
      );

      console.log("Lesson marked as complete!");
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    } finally {
      setMarkingComplete(false);
    }
  };

  // Check if navigation buttons should be enabled
  const hasNextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < chapterLessons.length - 1;
  const hasPreviousLesson = currentLessonIndex > 0;

  // Calculate completion progress
  const completedCount = chapterLessons.filter((l) => l.completed).length;
  const completionPercentage =
    chapterLessons.length > 0
      ? (completedCount / chapterLessons.length) * 100
      : 0;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-5 h-5" />;
      case "article":
        return <FileText className="w-5 h-5" />;
      case "quiz":
        return <HelpCircle className="w-5 h-5" />;
      case "assignment":
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user" as const,
      content: chatInput.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/lesson/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages
            .slice(-8) // keep prompt short
            .map((m) => ({ role: m.role, content: m.content }))
            .concat([{ role: "user", content: userMessage.content }]),
          context: {
            course: course ? { id: course.id, name: course.name } : undefined,
            chapter: chapter
              ? {
                  id: chapter.id,
                  title: chapter.title,
                  order: chapter.order,
                  description: chapter.description,
                }
              : undefined,
            lesson: lesson
              ? {
                  id: lesson.id,
                  title: lesson.title,
                  type: lesson.type,
                  description: lesson.description,
                  duration: lesson.duration,
                  content: lesson.content || null,
                  videoUrl: lesson.videoUrl || null,
                }
              : undefined,
          },
        }),
      });

      if (!res.ok) {
        throw new Error("Assistant error");
      }

      const data = await res.json();
      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant" as const,
        content: data.message || "",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content:
            "I ran into an issue answering that. Please try again in a moment.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading lesson...</div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-xl mb-4">Lesson not found</div>
          {/* <button
            onClick={handleBackToCourse}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Back to Course
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={handleBackToCourse}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </button> */}

            <div className="text-sm text-muted-foreground">
              {course?.name}
              {chapter && (
                <>
                  <span className="mx-2">/</span>
                  <span>
                    Chapter {chapter.order}: {chapter.title}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Lesson Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-2 text-primary">
              {getLessonIcon(lesson.type)}
              <span className="text-sm font-medium capitalize">
                {lesson.type}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{lesson.duration}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="text-lg text-muted-foreground">
              {lesson.description}
            </p>
          )}
        </div>

        {/* Lesson Content Based on Type */}
        <div className="space-y-8">
          {lesson.type === "video" && lesson.videoUrl && (
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video Player</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Video URL: {lesson.videoUrl}
                  </p>
                </div>
              </div>
            </div>
          )}

          {lesson.type === "article" && lesson.content && (
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
              </div>
            </div>
          )}

          {lesson.type === "quiz" && (
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center">
                <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quiz</h3>
                <p className="text-muted-foreground">
                  Quiz functionality will be implemented here
                </p>
              </div>
            </div>
          )}

          {lesson.type === "assignment" && (
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="text-center">
                <CheckSquare className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Assignment</h3>
                <p className="text-muted-foreground">
                  Assignment functionality will be implemented here
                </p>
                {lesson.content && (
                  <div className="mt-6 text-left">
                    <div className="prose prose-neutral dark:prose-invert max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Resources Section */}
          {lesson.resources && lesson.resources.length > 0 && (
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <div className="space-y-3">
                {lesson.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {resource.type}
                      </p>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chapter Progress */}
        {chapterLessons.length > 0 && (
          <div className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Chapter Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Progress: {completedCount} of {chapterLessons.length} lessons
                  completed
                </span>
                <span>{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={handleBackToCourse}
              className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course</span>
            </button>

            {hasPreviousLesson && (
              <button
                onClick={handlePreviousLesson}
                className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {lesson?.completed ? (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <CheckSquare className="w-4 h-4" />
                <span>Completed</span>
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                disabled={markingComplete}
                className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {markingComplete ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>
            )}

            {hasNextLesson ? (
              <button
                onClick={handleNextLesson}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next Lesson
              </button>
            ) : (
              <button
                disabled
                className="bg-muted text-muted-foreground px-4 py-2 rounded-lg cursor-not-allowed opacity-50"
              >
                {chapterLessons.length > 0 ? "Last Lesson" : "No More Lessons"}
              </button>
            )}
          </div>
        </div>

        {/* Lesson Progress Indicator */}
        {chapterLessons.length > 0 && (
          <div className="mt-8 text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Lesson {currentLessonIndex + 1} of {chapterLessons.length}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentLessonIndex + 1) / chapterLessons.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-40">
        {chatOpen ? (
          <div className="w-[360px] max-w-[90vw] bg-card border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground">
                  Lesson Assistant
                </span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-72 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  Ask anything about this lesson. I’ll keep answers on-topic.
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-10 bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm"
                      : "mr-10 bg-muted text-foreground rounded-lg px-3 py-2 text-sm"
                  }
                >
                  {m.content}
                </div>
              ))}
              {chatLoading && (
                <div className="mr-10 bg-muted text-foreground rounded-lg px-3 py-2 text-sm opacity-80">
                  Thinking...
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border flex items-center space-x-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!chatLoading) sendChat();
                  }
                }}
                placeholder="Ask about this lesson..."
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                disabled={chatLoading}
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-md px-3 py-2 disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg hover:bg-primary/90"
            aria-label="Open lesson assistant"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Ask AI</span>
          </button>
        )}
      </div>
    </div>
  );
}
