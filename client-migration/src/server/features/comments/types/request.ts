export type CreateCommentPayload = {
  courseId: string;
  content: string;
  parentId?: string;
};

export type UpdateCommentPayload = {
  content: string;
};
