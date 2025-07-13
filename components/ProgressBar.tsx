import React from 'react';
import { Progress } from './ui/progress';

interface ProgressBarProps {
  used: number;
  total: number;
  className?: string;
}

export function ProgressBar({ used, total, className = '' }: ProgressBarProps) {
  const percentage = Math.min((used / total) * 100, 100);
  const remaining = Math.max(total - used, 0);

  const getColorClass = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm" dir="rtl">
        <span>حجم مصرفی: {used.toFixed(1)} مگابایت</span>
        <span>باقی‌مانده: {remaining.toFixed(1)} مگابایت</span>
      </div>
      <Progress value={percentage} className="w-full h-2" />
      <div className={`text-sm ${getColorClass()}`} dir="rtl">
        {percentage.toFixed(1)}% از سهمیه مصرف شده
      </div>
    </div>
  );
}