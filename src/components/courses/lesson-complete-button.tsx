"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

interface LessonCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function LessonCompleteButton({
  lessonId,
  isCompleted: initialCompleted,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleToggleComplete() {
    setIsLoading(true);
    setXpEarned(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      if (isCompleted) {
        const { error } = await supabase
          .from("user_progress")
          .update({ completed: false, completed_at: null })
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);

        if (error) throw error;
        setIsCompleted(false);
      } else {
        const { error } = await supabase.from("user_progress").upsert(
          {
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

        if (error) throw error;
        setIsCompleted(true);
        setXpEarned(10);
        setTimeout(() => setXpEarned(null), 3000);

        fetch("/api/gamification/lesson-xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lesson_id: lessonId }),
        }).catch(() => {});
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleToggleComplete}
        disabled={isLoading}
        variant={isCompleted ? "secondary" : "default"}
        size="lg"
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="size-4 text-green-500" />
            Completed
          </>
        ) : (
          <>
            <Circle className="size-4" />
            Mark as Complete
          </>
        )}
      </Button>
      {xpEarned && (
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
          <Sparkles className="size-3" />
          +{xpEarned} XP
        </span>
      )}
    </div>
  );
}
