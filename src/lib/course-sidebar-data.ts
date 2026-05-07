import type { SupabaseClient } from "@supabase/supabase-js";
import type { CourseWithModules, UserProgress } from "@/lib/types/database";

export async function getCourseSidebarData(
  supabase: SupabaseClient,
  course: CourseWithModules,
  userId: string
) {
  const allLessons = course.modules.flatMap((mod) => mod.lessons);
  const allLessonIds = allLessons.map((l) => l.id);
  const allModuleIds = course.modules.map((m) => m.id);

  const [progressResult, quizResult] = await Promise.all([
    supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("completed", true)
      .in("lesson_id", allLessonIds),
    supabase
      .from("module_quizzes")
      .select("id, module_id")
      .in("module_id", allModuleIds),
  ]);

  const completedLessonIds = new Set(
    (progressResult.data ?? []).map((p: Pick<UserProgress, "lesson_id">) => p.lesson_id)
  );

  const quizByModule = new Map<string, string>();
  const passedQuizIds = new Set<string>();

  if (quizResult.data) {
    for (const q of quizResult.data) quizByModule.set(q.module_id, q.id);

    const quizIds = quizResult.data.map((q) => q.id);
    if (quizIds.length > 0) {
      const { data: quizResults } = await supabase
        .from("module_quiz_results")
        .select("module_quiz_id")
        .eq("user_id", userId)
        .eq("passed", true)
        .in("module_quiz_id", quizIds);

      if (quizResults) {
        for (const r of quizResults) passedQuizIds.add(r.module_quiz_id);
      }
    }
  }

  return { completedLessonIds, quizByModule, passedQuizIds };
}
