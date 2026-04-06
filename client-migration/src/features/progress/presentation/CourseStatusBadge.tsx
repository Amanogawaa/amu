import { Badge } from '@/components/ui/badge';

interface CourseStatusBadgeProps {
  percentComplete: number;
  className?: string;
}

export function CourseStatusBadge({
  percentComplete,
  className = '',
}: CourseStatusBadgeProps) {
  const getStatusInfo = () => {
    if (percentComplete === 0) {
      return { label: 'Not Started', variant: 'secondary' as const };
    }
    if (percentComplete === 100) {
      return { label: 'Completed', variant: 'default' as const };
    }
    return { label: 'In Progress', variant: 'outline' as const };
  };

  const { label, variant } = getStatusInfo();

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
