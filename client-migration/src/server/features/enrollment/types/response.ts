import type { Course } from '../../course/types';

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'dropped';
  createdAt: Date;
  updatedAt: Date;
}

export interface EnrollmentWithCourse extends Enrollment {
  course: Course;
}

export interface EnrollmentStatusResponse {
  isEnrolled: boolean;
  enrollment?: Enrollment;
}

export interface EnrollmentCountResponse {
  courseId: string;
  count: number;
}

export interface EnrollmentResponse {
  data:
    | Enrollment
    | Enrollment[]
    | EnrollmentWithCourse
    | EnrollmentWithCourse[];
  message: string;
  total?: number;
}

export interface EnrollmentFilters {
  status?: 'active' | 'completed' | 'dropped';
  courseId?: string;
  limit?: number;
  offset?: number;
}
