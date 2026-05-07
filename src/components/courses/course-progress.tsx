"use client";

import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";

interface CourseProgressProps {
  value: number;
  label: string;
  display: string;
}

export function CourseProgress({ value, label, display }: CourseProgressProps) {
  return (
    <Progress value={value}>
      <ProgressLabel className="text-xs">{label}</ProgressLabel>
      <ProgressValue>{() => display}</ProgressValue>
    </Progress>
  );
}
