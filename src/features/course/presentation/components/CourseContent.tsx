import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2Icon, InfoIcon } from 'lucide-react';

interface CourseContentProps {
  description: string;
  learningOutcomes: string[];
  prerequisites: string;
}

export const CourseContent = ({
  description,
  learningOutcomes,
  prerequisites,
}: CourseContentProps) => {
  return (
    <div className="space-y-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <InfoIcon className="h-5 w-5 text-primary" />
            About This Course
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2Icon className="h-5 w-5 text-primary" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {learningOutcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-relaxed">
                  {outcome}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {prerequisites && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <InfoIcon className="h-5 w-5 text-primary" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {prerequisites}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
