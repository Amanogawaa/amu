export const generateCoursePrompt = (args: {
  category: string;
  topic: string;
  level: string;
  duration: string;
  noOfChapters: number;
  language: string;
}) => `You are a course design expert. Generate course metadata (overview information only) based on the specifications below. Do NOT generate chapter content - only the course overview.

**Input Specifications**:
- Category: ${args.category}
- Topic: ${args.topic}
- Level: ${args.level} (use exactly: "beginner", "intermediate", or "advanced")
- Total Duration: ${args.duration}
- Number of Chapters: ${args.noOfChapters}
- Language: ${args.language}

**Required JSON Structure**:
Return a JSON object with this exact structure:
{
  "course": {
    "name": "Course Name Here",
    "subtitle": "Optional subtitle",
    "description": "Course description",
    "category": "${args.category}",
    "topic": "${args.topic}",
    "level": "${args.level}",
    "language": "${args.language}",
    "prerequisites": "Prerequisites text",
    "learningOutcomes": ["outcome1", "outcome2", "..."],
    "duration": "${args.duration}",
    "noOfChapters": ${args.noOfChapters},
    "publish": false,
    "includeCertificate": false,
    "courseBanner": "/images/banners/${args.topic
      .toLowerCase()
      .replace(/\s+/g, "-")}-banner.jpg"
  }
}

**Instructions**:
- Generate a compelling course name (concise, professional)
- Create an optional subtitle (brief, catchy tagline)
- Write a comprehensive description (200-300 words) covering what students will learn
- List 5-8 specific learning outcomes (what students will be able to do after completion)
- Include prerequisites as a string (e.g., "Basic understanding of programming concepts" or "None" for beginners)
- Set publish to true for intermediate/advanced courses, false for beginner courses
- Set includeCertificate to true for courses longer than 4 hours
- Ensure all content is appropriate for the specified level and topic

**Level Guidelines**:
- beginner: Assumes no prior knowledge, focuses on fundamentals
- intermediate: Assumes basic knowledge, builds practical skills
- advanced: Assumes solid foundation, covers complex topics and best practices

Return only the course metadata as a JSON object wrapped in {"course": {...}}.`;

export const generateChaptersPrompt = (args: {
  courseId: string;
  title: string;
  description: string;
  learningOutcomes: string[];
  duration: string;
  noOfChapters: number;
  level: string;
  language: string;
}) => `You are a course design expert. Based on the course details below, generate a structured chapter outline.
  
  **Course Information**:
  - Course Name: ${args.title}
  - Description: ${args.description}
  - Learning Outcomes: ${args.learningOutcomes}
  - Total Duration: ${args.duration}
  - Number of Chapters: ${args.noOfChapters}
  - Level: ${args.level}
  - Language: ${args.language}
  
  **Output Requirements**:
  - Return ONLY a JSON object in this structure:
  {
    "chapters": [
      {
        "chapterId": 1,
        "title": "Chapter Title",
        "description": "Brief overview of the chapter (50-100 words)",
        "estimatedDuration": "e.g. 1h 15m",
        "lessons": [
          {
            "lessonId": "1.1",
            "title": "Lesson Title",
            "type": "video | article | quiz | assignment",
            "duration": "e.g. 15m",
            "description": "1-2 sentence overview of what this lesson covers"
          }
        ]
      }
    ]
  }
  
  **Instructions**:
  - Divide the course logically into ${args.noOfChapters} chapters that progressively build knowledge.
  - Each chapter should have 3–6 lessons.
  - Each lesson should specify a type:
    - Use "video" for conceptual/explainer lessons,
    - "article" for readings/notes,
    - "quiz" for knowledge checks,
    - "assignment" for practice/project.
  - Balance the duration so the total across all chapters roughly matches ${args.duration}.
  - Make chapter/lesson titles clear and engaging.
  - Ensure complexity matches the level: 
    - Beginner → fundamentals, gentle intro
    - Intermediate → hands-on skills, practical use cases
    - Advanced → deep dives, best practices, complex applications
  
  Return only the JSON object with the chapters array.`;

export const generateLessonsPrompt = (args: {
  chapterTitle: string;
  chapterDescription: string;
  chapterOrder: number;
  estimatedDuration: string;
  courseName: string;
  level: string;
  language: string;
}) => `You are a course design expert. Based on the following chapter information, generate a structured set of lessons.

**Course Information**:
- Course Name: ${args.courseName}
- Level: ${args.level}
- Language: ${args.language}

**Chapter Information**:
- Chapter ${args.chapterOrder}: ${args.chapterTitle}
- Description: ${args.chapterDescription}
- Estimated Duration: ${args.estimatedDuration}

**Output Requirements**:
- Return ONLY a JSON object in this structure:
{
  "lessons": [
    {
      "lessonId": "1.1",
      "title": "Lesson Title",
      "type": "video | article | quiz | assignment",
      "duration": "e.g. 15m",
      "description": "1–2 sentence overview of what this lesson covers",
      "content": "Detailed lesson content for articles (optional)",
      "videoUrl": "Video URL for video lessons (optional)",
      "resources": [
        {
          "title": "Resource Title",
          "url": "https://example.com",
          "type": "pdf | link | doc | image"
        }
      ]
    }
  ]
}

**Instructions**:
- Create 3–6 lessons for this chapter.
- Each lesson must have a type:
  - "video" for conceptual/explainer lessons,
  - "article" for readings/notes,
  - "quiz" for knowledge checks,
  - "assignment" for practice/project.
- Distribute lesson durations so their total ≈ ${args.estimatedDuration}.
- Ensure lesson titles are clear, practical, and engaging.
- Tailor the complexity to match the course level (${args.level}).
- For "article" type lessons, include detailed content in markdown format.
- For "video" type lessons, you can suggest placeholder video URLs or leave empty.
- Include 1-3 relevant resources per lesson when appropriate.
- lessonId should follow format: "{chapterOrder}.{lessonNumber}" (e.g., "1.1", "1.2", etc.)

Return only the JSON object with the lessons array.`;
