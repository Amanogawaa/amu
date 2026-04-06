import { CapstoneSubmission } from '../types';

export interface CapstoneGuideline {
  id: string;
  courseId: string;
  title: string;
  description: string;
  objectives: string[];
  gettingStarted?: {
    prerequisites: string[];
    setupInstructions: string[];
    recommendedApproach: string;
  };
  implementationRoadmap?: Array<{
    phase: string;
    duration: string;
    tasks: string[];
    modules: string[];
  }>;
  requiredFeatures: string[];
  suggestedFeatures: string[];
  technicalRequirements: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    apis: string[];
    database: string;
  };
  projectStructure?: {
    description: string;
    example: string;
  };
  deliverables: string[];
  evaluationCriteria: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
  commonChallenges?: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: string[];
  examples: string[];
  moduleMapping?: Array<{
    moduleName: string;
    skills: string[];
    application: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CapstoneReview {
  id: string;
  capstoneSubmissionId: string;
  reviewerId: string;
  reviewerName?: string;
  reviewerEmail?: string;
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
  helpfulCount: number;
  replyCount: number; 
  images: string[]; 
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface CapstoneSubmissionResponse {
  data: CapstoneSubmission;
  message: string;
}

export interface CapstoneSubmissionsListResponse {
  data: {
    submissions: CapstoneSubmission[];
    total: number;
  };
  message: string;
}

export interface CapstoneReviewResponse {
  data: CapstoneReview;
  message: string;
}

export interface CapstoneReviewsListResponse {
  data: {
    reviews: CapstoneReview[];
    total: number;
    averageRating?: number;
  };
  message: string;
}

export interface CapstoneLikeToggleResponse {
  data: {
    liked: boolean;
    likeCount: number;
  };
  message: string;
}
