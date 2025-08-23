// // 1. Simple In-Memory Queue (No external dependencies needed)

// // 2. Enhanced Course Generation Route
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

//     // Generate course with rate limiting
//     const courseData = await SimpleQueue.add(`course_${topic}`, async () => {
//       const coursePrompt = generateCoursePrompt({
//         category,
//         topic,
//         level,
//         duration,
//         noOfChapters,
//         language,
//       });

//       const response = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           },
//           body: JSON.stringify({
//             messages: [{ role: "user", content: coursePrompt }],
//             model: "llama-3.1-8b-instant",
//             response_format: { type: "json_object" },
//             temperature: 0.7,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Groq API error: ${errorData.error?.message || response.statusText}`
//         );
//       }

//       return response.json();
//     });

//     const generatedContent = courseData.choices[0].message.content;
//     const parsed = JSON.parse(generatedContent);
//     const result = COURSESCHEMA.parse(parsed);

//     // Store course
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

//     // **KEY CHANGE**: Immediately trigger chapter generation in background
//     // Don't await this - let it run async
//     generateChaptersInBackground(insertedCourse.id, {
//       courseId: insertedCourse.id,
//       title: result.course.name,
//       description: result.course.description,
//       learningOutcomes: result.course.learningOutcomes,
//       duration: result.course.duration,
//       noOfChapters: result.course.noOfChapters,
//       level: result.course.level,
//       language: result.course.language,
//     }).catch((error) => {
//       console.error("Background chapter generation failed:", error);
//       // Could store error in database for user to see
//     });

//     return NextResponse.json({
//       success: true,
//       course: {
//         ...insertedCourse,
//         learningOutcomes: result.course.learningOutcomes,
//       },
//       chaptersGenerating: true, // Let client know chapters are being generated
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

// // 3. Background Chapter Generation (Non-blocking)
// async function generateChaptersInBackground(courseId: string, courseData: any) {
//   try {
//     // Use queue to prevent multiple simultaneous generations for same course
//     await SimpleQueue.add(`chapters_${courseId}`, async () => {
//       const chapterPrompt = generateChaptersPrompt(courseData);

//       const response = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           },
//           body: JSON.stringify({
//             messages: [{ role: "user", content: chapterPrompt }],
//             model: "meta-llama/llama-4-maverick-17b-128e-instruct",
//             response_format: { type: "json_object" },
//             temperature: 0.7,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Groq API error: ${response.statusText}`);
//       }

//       const data = await response.json();
//       const generatedContent = data.choices[0].message.content;
//       const parsed = JSON.parse(generatedContent);
//       const result = CHAPTERSCHEMA.parse(parsed);

//       // Store chapters
//       for (const chapter of result.chapters) {
//         await db.insert(chapters).values({
//           courseId: courseId,
//           title: chapter.title,
//           description: chapter.description,
//           estimatedDuration: chapter.estimatedDuration,
//           order: chapter.chapterId,
//         });
//       }

//       console.log(
//         `Generated ${result.chapters.length} chapters for course ${courseId}`
//       );
//       return result.chapters;
//     });
//   } catch (error) {
//     console.error(`Failed to generate chapters for course ${courseId}:`, error);
//     // You could store this error in database to show user later
//   }
// }

// // 4. Updated Chapter Route (For manual generation if needed)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       courseId,
//       title,
//       description,
//       learningOutcomes,
//       duration,
//       noOfChapters,
//       level,
//       language,
//     } = body;

//     // Check if chapters already exist
//     const existingChapters = await db
//       .select()
//       .from(chapters)
//       .where(eq(chapters.courseId, courseId));

//     if (existingChapters.length > 0) {
//       return NextResponse.json({
//         success: true,
//         chapters: existingChapters,
//         message: "Chapters already exist for this course",
//       });
//     }

//     // Generate chapters with queue protection
//     const result = await SimpleQueue.add(`chapters_${courseId}`, async () => {
//       // Your existing chapter generation logic here
//       const chapterPrompt = generateChaptersPrompt({
//         courseId,
//         title,
//         description,
//         learningOutcomes,
//         duration,
//         noOfChapters,
//         level,
//         language,
//       });

//       const response = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           },
//           body: JSON.stringify({
//             messages: [{ role: "user", content: chapterPrompt }],
//             model: "meta-llama/llama-4-maverick-17b-128e-instruct",
//             response_format: { type: "json_object" },
//             temperature: 0.7,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Groq API error: ${errorData.error?.message || response.statusText}`
//         );
//       }

//       const data = await response.json();
//       const generatedContent = data.choices[0].message.content;
//       const parsed = JSON.parse(generatedContent);
//       const chapterResult = CHAPTERSCHEMA.parse(parsed);

//       const storedChapters = [];
//       for (const chapter of chapterResult.chapters) {
//         const [insertedChapter] = await db
//           .insert(chapters)
//           .values({
//             courseId: courseId,
//             title: chapter.title,
//             description: chapter.description,
//             estimatedDuration: chapter.estimatedDuration,
//             order: chapter.chapterId,
//           })
//           .returning();

//         storedChapters.push(insertedChapter);
//       }

//       return storedChapters;
//     });

//     return NextResponse.json({
//       success: true,
//       chapters: result,
//     });
//   } catch (error) {
//     console.error("Chapter generation error:", error);
//     return NextResponse.json(
//       {
//         error: `Failed to generate chapters: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }

// // 5. Enhanced Lesson Route (Keep mostly same, add queue)
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       chapterId,
//       chapterTitle,
//       chapterDescription,
//       chapterOrder,
//       estimatedDuration,
//       courseName,
//       level,
//       language,
//     } = body;

//     if (!chapterId || !chapterTitle || !courseName) {
//       return NextResponse.json(
//         {
//           error: "Missing required fields: chapterId, chapterTitle, courseName",
//         },
//         { status: 400 }
//       );
//     }

//     // Check if lessons already exist
//     const existingLessons = await db
//       .select()
//       .from(lessons)
//       .where(eq(lessons.chapterId, chapterId));

//     if (existingLessons.length > 0) {
//       return NextResponse.json({
//         success: true,
//         lessons: existingLessons,
//         message: "Lessons already exist for this chapter",
//       });
//     }

//     // Generate lessons with queue protection
//     const result = await SimpleQueue.add(`lessons_${chapterId}`, async () => {
//       const lessonsPrompt = generateLessonsPrompt({
//         chapterTitle,
//         chapterDescription: chapterDescription || "",
//         chapterOrder: chapterOrder || 1,
//         estimatedDuration: estimatedDuration || "1h",
//         courseName,
//         level: level || "beginner",
//         language: language || "en",
//       });

//       const response = await fetch(
//         "https://api.groq.com/openai/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//           },
//           body: JSON.stringify({
//             messages: [{ role: "user", content: lessonsPrompt }],
//             model: "llama-3.1-8b-instant",
//             response_format: { type: "json_object" },
//             temperature: 0.7,
//           }),
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           `Groq API error: ${errorData.error?.message || response.statusText}`
//         );
//       }

//       const data = await response.json();
//       const generatedContent = data.choices[0].message.content;
//       const parsed = JSON.parse(generatedContent);
//       const lessonResult = LESSONSCHEMA.parse(parsed);

//       const storedLessons = [];

//       for (let index = 0; index < lessonResult.lessons.length; index++) {
//         const lesson = lessonResult.lessons[index];

//         const lessonOrder = lesson.lessonId.includes(".")
//           ? parseInt(lesson.lessonId.split(".")[1])
//           : index + 1;

//         const [insertedLesson] = await db
//           .insert(lessons)
//           .values({
//             chapterId: chapterId,
//             title: lesson.title,
//             type: lesson.type,
//             description: lesson.description,
//             duration: lesson.duration,
//             content: lesson.content || null,
//             videoUrl: lesson.videoUrl || null,
//             order: lessonOrder,
//           })
//           .returning();

//         if (lesson.resources && lesson.resources.length > 0) {
//           const resourcesData = lesson.resources.map((resource) => ({
//             lessonId: insertedLesson.id,
//             title: resource.title,
//             url: resource.url,
//             type: resource.type,
//           }));

//           await db.insert(lessonResources).values(resourcesData);
//         }

//         storedLessons.push({
//           ...insertedLesson,
//           resources: lesson.resources || [],
//         });
//       }

//       return { lessons: lessonResult.lessons, storedLessons };
//     });

//     return NextResponse.json({
//       success: true,
//       message: `Successfully generated ${result.storedLessons.length} lessons for chapter: ${chapterTitle}`,
//       lessons: result.lessons,
//       storedLessons: result.storedLessons,
//     });
//   } catch (error) {
//     console.error("Lesson generation error:", error);

//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           error: "Invalid lesson data structure",
//           details: error.issues,
//         },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       {
//         error: `Failed to generate lessons: ${
//           error instanceof Error ? error.message : "Unknown error"
//         }`,
//       },
//       { status: 500 }
//     );
//   }
// }
