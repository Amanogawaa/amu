import {
  generateChaptersPrompt,
  generateCoursePrompt,
} from "@/config/ai-templates";
import { db } from "@/db";
import { chapters, courses } from "@/db/schema";
import { SimpleQueue } from "@/utils/simple-queue";
import { CHAPTERSCHEMA, COURSESCHEMA } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { category, topic, level, duration, noOfChapters, language } = body;

//     if (!process.env.GROQ_API_KEY) {
//       return NextResponse.json(
//         { error: "Missing GROQ_API_KEY environment variable" },
//         { status: 500 }
//       );
//     }

//     const coursePrompt = generateCoursePrompt({
//       category,
//       topic,
//       level,
//       duration,
//       noOfChapters,
//       language,
//     });

//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//         },
//         body: JSON.stringify({
//           messages: [
//             {
//               role: "user",
//               content: coursePrompt,
//             },
//           ],
//           model: "llama-3.1-8b-instant",
//           response_format: { type: "json_object" },
//           temperature: 0.7,
//         }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         `Groq API error: ${errorData.error?.message || response.statusText}`
//       );
//     }

//     const data = await response.json();
//     const generatedContent = data.choices[0].message.content;
//     const parsed = JSON.parse(generatedContent);

//     const result = COURSESCHEMA.parse(parsed);

//     result.course.category = category;
//     result.course.topic = topic;
//     result.course.level = level;
//     result.course.duration = duration;
//     result.course.noOfChapters = noOfChapters;
//     result.course.language = language;

//     const [insertedCourse] = await db
//       .insert(courses)
//       .values({
//         name: result.course.name,
//         subtitle: result.course.subtitle,
//         description: result.course.description,
//         category: result.course.category,
//         topic: result.course.topic,
//         level: result.course.level,
//         language: result.course.language,
//         prerequisites: result.course.prerequisites,
//         learningOutcomes: JSON.stringify(result.course.learningOutcomes),
//         duration: result.course.duration,
//         noOfChapters: result.course.noOfChapters,
//         publish: result.course.publish,
//         includeCertificate: result.course.includeCertificate,
//         bannerUrl: result.course.courseBanner,
//       })
//       .returning();

//     console.log("Course stored with ID:", insertedCourse.id);

//     return NextResponse.json({
//       success: true,
//       course: {
//         ...insertedCourse,
//         learningOutcomes: result.course.learningOutcomes,
//       },
//     });
//   } catch (error) {
//     console.error("Course generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate course: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, topic, level, duration, noOfChapters, language } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Missing GROQ_API_KEY environment variable" },
        { status: 500 }
      );
    }

    const coureData = await SimpleQueue.add("", async () => {
      const coursePrompt = generateCoursePrompt({
        category,
        topic,
        level,
        duration,
        noOfChapters,
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
            messages: [{ role: "user", content: coursePrompt }],
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

      return response.json();
    });

    console.log(coureData.choice);
    // const generateContent = coureData.choice[0].message.content;
    // const parsed = JSON.parse(generateContent);
    // const result = COURSESCHEMA.parse(parsed);

    // result.course.category = category;
    // result.course.topic = topic;
    // result.course.level = level;
    // result.course.duration = duration;
    // result.course.noOfChapters = noOfChapters;
    // result.course.language = language;

    // const [insertedCourse] = await db
    //   .insert(courses)
    //   .values({
    //     name: result.course.name,
    //     subtitle: result.course.subtitle,
    //     description: result.course.description,
    //     category: result.course.category,
    //     topic: result.course.topic,
    //     level: result.course.level,
    //     language: result.course.language,
    //     prerequisites: result.course.prerequisites,
    //     learningOutcomes: JSON.stringify(result.course.learningOutcomes),
    //     duration: result.course.duration,
    //     noOfChapters: result.course.noOfChapters,
    //     publish: result.course.publish,
    //     includeCertificate: result.course.includeCertificate,
    //     bannerUrl: result.course.courseBanner,
    //   })
    //   .returning();

    // generateChaptersInBackground(insertedCourse.id, {
    //   courseId: insertedCourse.id,
    //   title: result.course.name,
    //   description: result.course.description,
    //   learningOutcomes: result.course.learningOutcomes,
    //   duration: result.course.duration,
    //   noOfChapters: result.course.noOfChapters,
    //   level: result.course.level,
    //   language: result.course.language,
    // }).catch((error) => {
    //   console.error("Background chapter generation failed:", error);
    //   // Could store error in database for user to see
    // });

    return NextResponse.json({
      succes: true,
      // course: {
      //   ...insertedCourse,
      //   learningOutcomes: result.course.learningOutcomes,
      // },
      chaptersGenerating: true,
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

async function generateChaptersInBackground(courseId: string, courseData: any) {
  try {
    // Use queue to prevent multiple simultaneous generations for same course
    await SimpleQueue.add(`chapters_${courseId}`, async () => {
      const chapterPrompt = generateChaptersPrompt(courseData);

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
        throw new Error(`Groq API error: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedContent = data.choices[0].message.content;
      const parsed = JSON.parse(generatedContent);
      const result = CHAPTERSCHEMA.parse(parsed);

      // Store chapters
      for (const chapter of result.chapters) {
        await db.insert(chapters).values({
          courseId: courseId,
          title: chapter.title,
          description: chapter.description,
          estimatedDuration: chapter.estimatedDuration,
          order: chapter.chapterId,
        });
      }

      console.log(
        `Generated ${result.chapters.length} chapters for course ${courseId}`
      );
      return result.chapters;
    });
  } catch (error) {
    console.error(`Failed to generate chapters for course ${courseId}:`, error);
    // You could store this error in database to show user later
  }
}
