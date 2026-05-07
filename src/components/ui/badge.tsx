import { cn } from "@/lib/cn";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-emerald-500/10 text-emerald-400",
        variant === "secondary" && "bg-neutral-800 text-neutral-300",
        variant === "outline" && "border border-neutral-700 text-neutral-400",
        className
      )}
      {...props}
    />
  );
}
