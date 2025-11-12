export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (page: number) => [...queryKeys.courses.lists(), page] as const,
    infinite: (filters?: any) =>
      [...queryKeys.courses.all, 'infinite', filters] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    validation: (id: string) =>
      [...queryKeys.courses.detail(id), 'validation'] as const,
  },

  // Modules
  modules: {
    all: ['modules'] as const,
    lists: () => [...queryKeys.modules.all, 'list'] as const,
    list: (courseId: string) =>
      [...queryKeys.modules.lists(), courseId] as const,
    details: () => [...queryKeys.modules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.modules.details(), id] as const,
  },

  // Chapters
  chapters: {
    all: ['chapters'] as const,
    lists: () => [...queryKeys.chapters.all, 'list'] as const,
    list: (moduleId: string) =>
      [...queryKeys.chapters.lists(), moduleId] as const,
    details: () => [...queryKeys.chapters.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.chapters.details(), id] as const,
  },

  // Lessons
  lessons: {
    all: ['lessons'] as const,
    lists: () => [...queryKeys.lessons.all, 'list'] as const,
    list: (chapterId: string) =>
      [...queryKeys.lessons.lists(), chapterId] as const,
    details: () => [...queryKeys.lessons.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.lessons.details(), id] as const,
  },

  // Progress
  progress: {
    all: ['progress'] as const,
    summary: () => [...queryKeys.progress.all, 'summary'] as const,
    course: (courseId: string) =>
      [...queryKeys.progress.all, courseId] as const,
  },

  // Comments
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    course: (
      courseId: string,
      limit: number,
      offset: number,
      parentId?: string
    ) =>
      [
        ...queryKeys.comments.lists(),
        courseId,
        limit,
        offset,
        parentId,
      ] as const,
    detail: (id: string) => [...queryKeys.comments.all, id] as const,
    my: () => [...queryKeys.comments.all, 'my'] as const,
    replies: (parentId: string) =>
      [...queryKeys.comments.all, 'replies', parentId] as const,
  },

  // Likes
  likes: {
    all: ['likes'] as const,
    status: (courseId: string) =>
      [...queryKeys.likes.all, 'status', courseId] as const,
    course: (courseId: string, limit: number, offset: number) =>
      [...queryKeys.likes.all, courseId, limit, offset] as const,
    my: () => [...queryKeys.likes.all, 'my'] as const,
  },

  // Quiz
  quiz: {
    all: ['quiz'] as const,
    lesson: (lessonId: string) =>
      [...queryKeys.quiz.all, 'lesson', lessonId] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },
} as const;
