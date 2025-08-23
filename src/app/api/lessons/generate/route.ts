import { generateLessonsPrompt } from "@/config/ai-templates";
import { db } from "@/db";
import { chapters, lessonResources, lessons } from "@/db/schema";
import { LESSONSCHEMA } from "@/utils/types";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      chapterId,
      chapterTitle,
      chapterDescription,
      chapterOrder,
      estimatedDuration,
      courseName,
      level,
      language,
    } = body;

    if (!chapterId || !chapterTitle || !courseName) {
      return NextResponse.json(
        {
          error: "Missing required fields: chapterId, chapterTitle, courseName",
        },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const existingChapter = await db
      .select()
      .from(chapters)
      .where(eq(chapters.id, chapterId));

    if (existingChapter.length === 0) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const lessonsPrompt = generateLessonsPrompt({
      chapterTitle,
      chapterDescription: chapterDescription || "",
      chapterOrder: chapterOrder || 1,
      estimatedDuration: estimatedDuration || "1h",
      courseName,
      level: level || "beginner",
      language: language || "en",
    });

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: lessonsPrompt }],
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    const parsed = JSON.parse(generatedContent);

    const result = LESSONSCHEMA.parse(parsed);

    const storedLessons = [];

    for (let index = 0; index < result.lessons.length; index++) {
      const lesson = result.lessons[index];

      const lessonOrder = lesson.lessonId.includes(".")
        ? parseInt(lesson.lessonId.split(".")[1])
        : index + 1;

      // Insert lesson
      const [insertedLesson] = await db
        .insert(lessons)
        .values({
          chapterId: chapterId,
          title: lesson.title,
          type: lesson.type,
          description: lesson.description,
          duration: lesson.duration,
          content: lesson.content || null,
          videoUrl: lesson.videoUrl || null,
          order: lessonOrder,
        })
        .returning();

      if (lesson.resources && lesson.resources.length > 0) {
        const resourcesData = lesson.resources.map((resource) => ({
          lessonId: insertedLesson.id,
          title: resource.title,
          url: resource.url,
          type: resource.type,
        }));

        await db.insert(lessonResources).values(resourcesData);
      }

      storedLessons.push({
        ...insertedLesson,
        resources: lesson.resources || [],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${storedLessons.length} lessons for chapter: ${chapterTitle}`,
      lessons: result.lessons,
      storedLessons: storedLessons,
    });
  } catch (error) {
    console.error("Lesson generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid lesson data structure",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: `Failed to generate lessons: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
