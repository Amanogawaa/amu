'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface LevelFilterPanelProps {
  selectedLevel?: string;
  onLevelChange: (level: string | undefined) => void;
}

const levels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export function LevelFilterPanel({
  selectedLevel,
  onLevelChange,
}: LevelFilterPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter by Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!selectedLevel ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onLevelChange(undefined)}
          >
            All Levels
          </Badge>
          {levels.map((level) => (
            <Badge
              key={level.value}
              variant={selectedLevel === level.value ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => onLevelChange(level.value)}
            >
              {level.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
