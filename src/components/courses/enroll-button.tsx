"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { PlayCircle, Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  firstLessonUrl: string;
}

export function EnrollButton({ courseId, firstLessonUrl }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleEnroll() {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error: insertError } = await supabase.from("user_enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          router.push(firstLessonUrl);
          return;
        }
        setError("Failed to enroll. Please try again.");
        return;
      }

      router.push(firstLessonUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={handleEnroll} disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enrolling...
          </>
        ) : (
          <>
            <PlayCircle className="size-4" />
            Start Course
          </>
        )}
      </Button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
