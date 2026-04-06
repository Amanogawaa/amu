export type Like = {
  id: string;
  courseId: string;
  userId: string;
  createdAt: Date;
};

export type LikeStatusResponse = {
  data: {
    liked: boolean;
    likesCount: number;
  };
  message: string;
};

export type LikesListResponse = {
  data: {
    likes: Like[];
    total: number;
  };
  message: string;
};

export type MyLikesResponse = {
  data: Like[];
  message: string;
  total: number;
};
