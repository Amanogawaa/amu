export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    lists: () => [...queryKeys.courses.all, "list"] as const,
    list: (page: number) => [...queryKeys.courses.lists(), page] as const,
    infinite: (filters?: any) =>
      [...queryKeys.courses.all, "infinite", filters] as const,
    details: () => [...queryKeys.courses.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    validation: (id: string) =>
      [...queryKeys.courses.detail(id), "validation"] as const,
  },

  // Chapters
  chapters: {
    all: ["chapters"] as const,
    lists: () => [...queryKeys.chapters.all, "list"] as const,
    list: (courseId: string) =>
      [...queryKeys.chapters.lists(), courseId] as const,
    details: () => [...queryKeys.chapters.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.chapters.details(), id] as const,
  },

  // lesson assistant
  lesson_assistant: {},

  // Lessons
  lessons: {
    all: ["lessons"] as const,
    lists: () => [...queryKeys.lessons.all, "list"] as const,
    list: (chapterId: string) =>
      [...queryKeys.lessons.lists(), chapterId] as const,
    details: () => [...queryKeys.lessons.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.lessons.details(), id] as const,
  },

  // Progress
  progress: {
    all: ["progress"] as const,
    summary: () => [...queryKeys.progress.all, "summary"] as const,
    course: (courseId: string) =>
      [...queryKeys.progress.all, courseId] as const,
  },

  // Enrollments
  enrollments: {
    all: ["enrollments"] as const,
    lists: () => [...queryKeys.enrollments.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.enrollments.lists(), filters] as const,
    status: (courseId: string) =>
      [...queryKeys.enrollments.all, "status", courseId] as const,
    count: (courseId: string) =>
      [...queryKeys.enrollments.all, "count", courseId] as const,
  },

  // Comments
  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    course: (
      courseId: string,
      limit: number,
      offset: number,
      parentId?: string,
    ) =>
      [
        ...queryKeys.comments.lists(),
        courseId,
        limit,
        offset,
        parentId,
      ] as const,
    detail: (id: string) => [...queryKeys.comments.all, id] as const,
    my: () => [...queryKeys.comments.all, "my"] as const,
    replies: (parentId: string) =>
      [...queryKeys.comments.all, "replies", parentId] as const,
  },

  // Likes
  likes: {
    all: ["likes"] as const,
    status: (courseId: string) =>
      [...queryKeys.likes.all, "status", courseId] as const,
    course: (courseId: string, limit: number, offset: number) =>
      [...queryKeys.likes.all, courseId, limit, offset] as const,
    my: () => [...queryKeys.likes.all, "my"] as const,
  },

  // Quiz
  quiz: {
    all: ["quiz"] as const,
    lesson: (lessonId: string) =>
      [...queryKeys.quiz.all, "lesson", lessonId] as const,
    attempts: (quizId: string) =>
      [...queryKeys.quiz.all, "attempts", quizId] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    analytics: () => [...queryKeys.user.all, "analytics"] as const,
    publicProfile: (userId: string) =>
      [...queryKeys.user.all, "publicProfile", userId] as const,
  },

  // Capstone
  capstone: {
    all: ["capstone"] as const,

    // Guidelines
    guidelines: () => [...queryKeys.capstone.all, "guidelines"] as const,
    guidelineByCourse: (courseId: string) =>
      [...queryKeys.capstone.guidelines(), "course", courseId] as const,
    guidelineById: (id: string) =>
      [...queryKeys.capstone.guidelines(), id] as const,

    // Submissions
    submissions: {
      all: () => [...queryKeys.capstone.all, "submissions"] as const,
      lists: () => [...queryKeys.capstone.submissions.all(), "list"] as const,
      list: (filters?: any) =>
        [...queryKeys.capstone.submissions.lists(), filters] as const,
      details: () =>
        [...queryKeys.capstone.submissions.all(), "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.capstone.submissions.details(), id] as const,
    },

    // Reviews
    reviews: {
      all: () => [...queryKeys.capstone.all, "reviews"] as const,
      lists: () => [...queryKeys.capstone.reviews.all(), "list"] as const,
      list: (filters?: any) =>
        [...queryKeys.capstone.reviews.lists(), filters] as const,
      details: () => [...queryKeys.capstone.reviews.all(), "detail"] as const,
      detail: (id: string) =>
        [...queryKeys.capstone.reviews.details(), id] as const,
    },

    // Likes
    likeStatus: (submissionId: string) =>
      [...queryKeys.capstone.all, "like-status", submissionId] as const,
  },

  // Leaderboards
  leaderboards: {
    all: ["leaderboards"] as const,
    lists: () => [...queryKeys.leaderboards.all, "list"] as const,
    list: (filters?: any) =>
      [...queryKeys.leaderboards.lists(), filters] as const,
    stats: () => [...queryKeys.leaderboards.all, "stats"] as const,
    userStats: (userId?: string) =>
      [...queryKeys.leaderboards.all, "user", userId || "me"] as const,
    myStats: () => [...queryKeys.leaderboards.all, "user", "me"] as const,
  },
} as const;
