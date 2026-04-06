"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Lesson } from "@/server/features/lessons/types";
import { ExternalLink } from "lucide-react";

interface LessonMetadataProps {
  lesson: Lesson;
}

export const LessonMetadata = ({ lesson }: LessonMetadataProps) => {
  return (
    <>
      {/* Learning Outcome */}
      <Card>
        <CardContent className="">
          <h3 className="font-semibold mb-2">Learning Outcome</h3>
          <p className="text-muted-foreground">{lesson.learningOutcome}</p>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Prerequisites</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {lesson.prerequisites.map((prereq, idx) => (
                <li key={idx}>{prereq}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Resources */}
      {lesson.resources && lesson.resources.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Additional Resources</h3>
            <div className="grid gap-3">
              {lesson.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mt-1 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{resource.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {resource.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
