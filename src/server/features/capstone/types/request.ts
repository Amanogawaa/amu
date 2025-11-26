export interface CapstoneSubmission {
  id: string;
  userId: string;
  courseId: string;
  guidelineId: string;
  githubRepoUrl: string;
  githubRepoName: string;
  githubRepoOwner: string;
  title: string;
  description: string;
  repoMetadata: {
    language: string;
    stars: number;
    forks: number;
    lastUpdated: string;
    isPrivate: boolean;
  };
  submittedAt: string;
  updatedAt: string;
  viewCount: number;
  reviewCount: number;
  likeCount: number;
  averageRating?: number;
  screenshots: string[]; 
}

export interface CreateCapstoneSubmissionPayload {
  courseId: string;
  guidelineId: string;
  githubRepoUrl: string;
  title: string;
  description: string;
}

export interface UpdateCapstoneSubmissionPayload {
  githubRepoUrl?: string;
  title?: string;
  description?: string;
}

export interface CreateCapstoneReviewPayload {
  capstoneSubmissionId: string;
  parentReviewId?: string; 
  rating?: number; 
  feedback: string;
  highlights?: string[]; 
  suggestions?: string[]; 
  criteriaScores?: Array<{
    criteriaName: string;
    score: number;
    comment?: string;
  }>;
}

export interface UpdateCapstoneReviewPayload {
  rating?: number;
  feedback?: string;
  highlights?: string[];
  suggestions?: string[];
  criteriaScores?: Array<{
    criteriaName: string;
    score: number;
    comment?: string;
  }>;
}

export interface CapstoneSubmissionFilters {
  courseId?: string;
  userId?: string;
  sortBy?: 'recent' | 'popular' | 'mostReviewed' | 'topRated';
  limit?: number;
  offset?: number;
}

export interface CapstoneReviewFilters {
  capstoneSubmissionId?: string;
  reviewerId?: string;
  parentReviewId?: string | null; 
  limit?: number;
  offset?: number;
}
