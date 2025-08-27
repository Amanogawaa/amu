import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      context,
    }: {
      messages: { role: "user" | "assistant" | "system"; content: string }[];
      context: {
        course?: {
          id?: string;
          name?: string;
          level?: string;
          language?: string;
        };
        chapter?: {
          id?: string;
          title?: string;
          order?: number;
          description?: string;
        };
        lesson?: {
          id?: string;
          title?: string;
          type?: string;
          description?: string;
          duration?: string;
          content?: string | null;
          videoUrl?: string | null;
        };
      };
    } = body || {};

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable" },
        { status: 500 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const systemContent = `You are a helpful study assistant for an online course platform. Stay tightly on-topic and only answer questions relevant to the current course, chapter, or lesson. If a question is unrelated, politely steer the student back to the topic.

Context:
- Course: ${context?.course?.name || "Unknown Course"} (level: ${
      context?.course?.level || "n/a"
    }, language: ${context?.course?.language || "n/a"})
- Chapter: ${
      context?.chapter?.order ? `Chapter ${context.chapter.order}: ` : ""
    }${context?.chapter?.title || "n/a"}
- Lesson: ${context?.lesson?.title || "n/a"} (type: ${
      context?.lesson?.type || "n/a"
    }, duration: ${context?.lesson?.duration || "n/a"})
- Lesson description: ${context?.lesson?.description || "n/a"}

If helpful, provide concise step-by-step guidance, examples, and analogies. Prefer short answers first, then offer to elaborate. Use Markdown for code or lists when appropriate.`;

    const groqMessages = [
      { role: "system", content: systemContent },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          messages: groqMessages,
          model: "llama-3.1-8b-instant",
          temperature: 0.4,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData?.error?.message || "Assistant request failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content || "";

    return NextResponse.json({ success: true, message: assistantMessage });
  } catch (error) {
    console.error("Lesson assistant error:", error);
    return NextResponse.json(
      { error: "Failed to process assistant request" },
      { status: 500 }
    );
  }
}
