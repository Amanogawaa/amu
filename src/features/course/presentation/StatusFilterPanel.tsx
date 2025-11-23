'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

interface StatusFilterPanelProps {
  selectedStatus?: 'published' | 'unpublished' | 'archived' | 'all';
  onStatusChange: (
    status: 'published' | 'unpublished' | 'archived' | 'all'
  ) => void;
}

const statuses = [
  { value: 'all', label: 'All Courses' },
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'archived', label: 'Archived' },
];

export function StatusFilterPanel({
  selectedStatus = 'all',
  onStatusChange,
}: StatusFilterPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter by Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatus === status.value ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onStatusChange(status.value as any)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
