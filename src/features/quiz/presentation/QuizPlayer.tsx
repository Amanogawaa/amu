'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useSubmitQuiz } from '@/features/quiz/application/useQuiz';
import { Loader2 } from 'lucide-react';
import { Quiz } from '@/server/features/quiz/types';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load QuizResults - only loaded when quiz is submitted
const QuizResults = dynamic(
  () => import('./QuizResults').then((mod) => ({ default: mod.QuizResults })),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    ),
    ssr: false,
  }
);

interface QuizPlayerProps {
  quiz: Quiz;
  lessonId: string;
}

export const QuizPlayer = ({ quiz, lessonId }: QuizPlayerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const submitQuizMutation = useSubmitQuiz(quiz.id, lessonId);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })
    );

    await submitQuizMutation.mutateAsync(
      { answers: formattedAnswers },
      {
        onSuccess: () => {
          setShowResults(true);
        },
      }
    );
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const allQuestionsAnswered =
    Object.keys(answers).length === quiz.questions.length;
  const progress = (Object.keys(answers).length / quiz.questions.length) * 100;

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    submitQuizMutation.reset();
  };

  if (showResults && submitQuizMutation.data) {
    return (
      <QuizResults
        attempt={submitQuizMutation.data.data}
        quiz={quiz}
        onRetry={handleRetry}
      />
    );
  }

  const question = quiz.questions[currentQuestion];
  if (!question) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Question {currentQuestion + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{question.questionText}</p>

          {question.questionType === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() =>
                    handleAnswer(question.questionId, option.optionId)
                  }
                >
                  <input
                    type="radio"
                    name={`question-${question.questionId}`}
                    value={option.optionId}
                    checked={answers[question.questionId] === option.optionId}
                    onChange={() =>
                      handleAnswer(question.questionId, option.optionId)
                    }
                    className="h-4 w-4"
                  />
                  <Label className="flex-1 cursor-pointer font-normal">
                    {option.optionText}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {question.questionType === 'true-false' && (
            <div className="space-y-3">
              <div
                className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleAnswer(question.questionId, 'true')}
              >
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value="true"
                  checked={answers[question.questionId] === 'true'}
                  onChange={() => handleAnswer(question.questionId, 'true')}
                  className="h-4 w-4"
                />
                <Label className="flex-1 cursor-pointer font-normal">
                  True
                </Label>
              </div>
              <div
                className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleAnswer(question.questionId, 'false')}
              >
                <input
                  type="radio"
                  name={`question-${question.questionId}`}
                  value="false"
                  checked={answers[question.questionId] === 'false'}
                  onChange={() => handleAnswer(question.questionId, 'false')}
                  className="h-4 w-4"
                />
                <Label className="flex-1 cursor-pointer font-normal">
                  False
                </Label>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < quiz.questions.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered || submitQuizMutation.isPending}
              >
                {submitQuizMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Quiz'
                )}
              </Button>
            )}
          </div>

          {!allQuestionsAnswered &&
            currentQuestion === quiz.questions.length - 1 && (
              <p className="text-sm text-muted-foreground text-center">
                Please answer all questions before submitting
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
};
