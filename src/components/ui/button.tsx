import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function Button({ variant = "default", size = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50",
        variant === "default" && "bg-emerald-500 text-white hover:bg-emerald-600",
        variant === "secondary" && "bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
        variant === "outline" && "border border-neutral-700 text-neutral-200 hover:bg-neutral-800",
        variant === "ghost" && "text-neutral-400 hover:text-white hover:bg-neutral-800",
        size === "sm" && "h-8 px-3 text-sm",
        size === "default" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-6 text-base",
        className
      )}
      {...props}
    />
  );
}
