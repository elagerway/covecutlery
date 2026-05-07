"use client";

import { cn } from "@/lib/cn";

interface ProgressProps {
  value: number;
  className?: string;
  children?: React.ReactNode;
}

export function Progress({ value, className, children }: ProgressProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {children && <div className="flex items-center justify-between">{children}</div>}
      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-sm text-neutral-400", className)} {...props} />;
}

export function ProgressValue({ children }: { children: () => string }) {
  return <span className="text-sm font-medium text-white">{children()}</span>;
}
