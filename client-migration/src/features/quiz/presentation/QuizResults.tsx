'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';
import { QuizAttempt, Quiz } from '@/server/features/quiz/types';

interface QuizResultsProps {
  attempt: QuizAttempt;
  quiz: Quiz;
  onRetry?: () => void;
}

export const QuizResults = ({ attempt, quiz, onRetry }: QuizResultsProps) => {
  const { score, passed, answers } = attempt;
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalQuestions = quiz.questions.length;

  return (
    <div className="space-y-6">
      {/* Score Summary */}
      <Card className={passed ? 'border-green-500' : 'border-red-500'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {passed ? (
                <>
                  <Trophy className="h-6 w-6 text-green-500" />
                  Congratulations! You Passed!
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Quiz Not Passed
                </>
              )}
            </CardTitle>
            <Badge
              variant={passed ? 'default' : 'destructive'}
              className="text-lg px-4 py-2"
            >
              {score}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>
              Correct Answers:{' '}
              <strong>
                {correctCount}/{totalQuestions}
              </strong>
            </span>
            <span>
              Passing Score: <strong>{quiz.passingScore}%</strong>
            </span>
          </div>

          {!passed && onRetry && (
            <Button onClick={onRetry} className="w-full" variant="outline">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Review Your Answers</h3>
        {answers.map((answer, index) => {
          const question = quiz.questions.find(
            (q) => q.questionId === answer.questionId
          );
          if (!question) return null;

          return (
            <Card
              key={answer.questionId}
              className={
                answer.isCorrect ? 'border-green-200' : 'border-red-200'
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-medium flex-1">
                    <span className="text-muted-foreground">Q{index + 1}.</span>{' '}
                    {question.questionText}
                  </CardTitle>
                  {answer.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">
                      Your Answer:
                    </span>
                    <span
                      className={
                        answer.isCorrect ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {question.options?.find(
                        (opt) => opt.optionId === answer.selectedAnswer
                      )?.optionText || answer.selectedAnswer}
                    </span>
                  </div>

                  {!answer.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">
                        Correct Answer:
                      </span>
                      <span className="text-green-600">
                        {question.options?.find(
                          (opt) => opt.optionId === answer.correctAnswer
                        )?.optionText || answer.correctAnswer}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <span className="font-medium">Explanation: </span>
                    <span className="text-muted-foreground">
                      {answer.explanation}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
