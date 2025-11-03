export type Comment = {
  id: string;
  courseId: string;
  authorId: string;
  authorName?: string;
  authorEmail?: string;
  content: string;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
};

export type CommentResponse = {
  data: Comment;
  message: string;
};

export type CommentsListResponse = {
  data: {
    comments: Comment[];
    total: number;
  };
  message: string;
};

export type MyCommentsResponse = {
  data: Comment[];
  message: string;
  total: number;
};

export type RepliesResponse = {
  data: Comment[];
  message: string;
  total: number;
};
