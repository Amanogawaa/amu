import { generateChaptersPrompt } from "@/config/ai-templates";
import { db } from "@/db";
import { chapters } from "@/db/schema";
import { CHAPTERSCHEMA } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      courseId,
      title,
      description,
      learningOutcomes,
      duration,
      noOfChapters,
      level,
      language,
    } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const chapterPrompt = generateChaptersPrompt({
      courseId,
      title,
      description,
      learningOutcomes,
      duration,
      noOfChapters,
      level,
      language,
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
          messages: [{ role: "user", content: chapterPrompt }],
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
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

    const result = CHAPTERSCHEMA.parse(parsed);

    const storedChapters = [];

    for (const chapter of result.chapters) {
      const [insertedChapter] = await db
        .insert(chapters)
        .values({
          courseId: courseId,
          title: chapter.title,
          description: chapter.description,
          estimatedDuration: chapter.estimatedDuration,
          order: chapter.chapterId,
        })
        .returning();

      storedChapters.push({
        ...insertedChapter,
      });
    }

    return NextResponse.json({
      success: true,
      chapters: result.chapters,
    });
  } catch (error) {
    console.error("Course generation error:", error);
    return NextResponse.json(
      {
        error: `Failed to generate course: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
