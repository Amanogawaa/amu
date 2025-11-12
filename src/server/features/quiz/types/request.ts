export interface GenerateQuizRequest {
  lessonId: string;
  lessonName: string;
  previousLessonsContent: string;
  numberOfQuestions?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface SubmitQuizRequest {
  answers: {
    questionId: string;
    selectedAnswer: string;
  }[];
}
