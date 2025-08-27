import { lessons, lessonResources } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("id");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Lesson ID is required" },
        { status: 400 }
      );
    }

    const lesson = await db
      .select({
        id: lessons.id,
        chapterId: lessons.chapterId,
        title: lessons.title,
        type: lessons.type,
        description: lessons.description,
        duration: lessons.duration,
        videoUrl: lessons.videoUrl,
        content: lessons.content,
        order: lessons.order,
      })
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (lesson.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Get resources for this lesson
    const resources = await db
      .select()
      .from(lessonResources)
      .where(eq(lessonResources.lessonId, lessonId));

    const lessonWithResources = {
      ...lesson[0],
      resources,
    };

    return NextResponse.json({
      success: true,
      lesson: lessonWithResources,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson" },
      { status: 500 }
    );
  }
}
