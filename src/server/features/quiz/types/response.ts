export interface Quiz {
  id: string;
  lessonId: string;
  passingScore: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true-false';
  options?: QuizOption[];
  points: number;
}

export interface QuizOption {
  optionId: string;
  optionText: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  lessonId: string;
  quizId: string;
  answers: UserAnswer[];
  score: number;
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}
