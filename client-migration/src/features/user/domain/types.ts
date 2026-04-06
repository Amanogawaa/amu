export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfile {
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  isPrivate?: boolean;
}

export interface UserResponse {
  data: UserProfile;
  message: string;
}

export interface UploadProfilePictureResponse {
  data: { photoURL: string };
  message: string;
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  likesCount: number;
  enrollmentsCount: number;
  commentsCount: number;
  createdAt: Date;
}

export interface UserAnalytics {
  totalCoursesCreated: number;
  totalLikesReceived: number;
  totalEnrollments: number;
  totalComments: number;
  courses: CourseAnalytics[];
}

export interface UserAnalyticsResponse {
  data: UserAnalytics;
  message: string;
}
