import React from 'react';

interface ProgressBarProps {
  percent: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({
  percent,
  className = '',
  showLabel = true,
  size = 'md',
}: ProgressBarProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{clampedPercent}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className="bg-primary rounded-full transition-all duration-300 ease-in-out h-full"
          style={{ width: `${clampedPercent}%` }}
          role="progressbar"
          aria-valuenow={clampedPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
