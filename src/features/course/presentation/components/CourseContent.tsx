import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2Icon } from "lucide-react";

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
    <div>
      <h2 className="text-xl font-bold mb-3">About This Course</h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};
