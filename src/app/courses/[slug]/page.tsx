import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseProgress } from "@/components/courses/course-progress";
import { CourseSidebar } from "@/components/courses/course-sidebar";
import { getCourseSidebarData } from "@/lib/course-sidebar-data";
import { BookOpen, CheckCircle2, ChevronRight, Clock, PlayCircle, Zap, Trophy, Lock, Award } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CourseWithModules, Lesson, UserProgress } from "@/lib/types/database";

function estimateLessonMinutes(lesson: Lesson): number {
  const wordCount = (lesson.content ?? "").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// Maps an LMS course slug to its /train-to-be-sharp purchase-page routing slug
// (defaults to the same slug when they match).
const PURCHASE_ROUTING_SLUG: Record<string, string> = {
  "train-to-be-sharp": "one-inch-grinder",
};

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course, error } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (error || !course) notFound();

  const typedCourse = course as CourseWithModules;
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({ ...mod, lessons: mod.lessons.sort((a, b) => a.order - b.order) }));

  const totalLessons = typedCourse.modules.reduce((sum, mod) => sum + mod.lessons.length, 0);
  const { data: { user } } = await supabase.auth.getUser();

  let isEnrolled = false;
  let completedLessonIds = new Set<string>();
  let firstLessonSlug: string | null = null;
  let nextLessonSlug: string | null = null;
  let sidebarQuizByModule = new Map<string, string>();
  let sidebarPassedQuizIds = new Set<string>();

  if (typedCourse.modules.length > 0 && typedCourse.modules[0].lessons.length > 0) {
    firstLessonSlug = typedCourse.modules[0].lessons[0].slug;
  }

  if (user) {
    const { data: enrollment } = await supabase
      .from("user_enrollments")
      .select("*")
      .eq("course_id", typedCourse.id)
      .eq("user_id", user.id)
      .maybeSingle();

    isEnrolled = !!enrollment;

    if (!isEnrolled && user.email) {
      const admin = createAdminClient();
      const { data: pendingInvite } = await admin
        .from("course_invites")
        .select("id, expires_at")
        .eq("course_id", typedCourse.id)
        .eq("email", user.email.toLowerCase())
        .eq("status", "pending")
        .maybeSingle();

      if (pendingInvite && new Date(pendingInvite.expires_at) > new Date()) {
        const { error: enrollErr } = await admin
          .from("user_enrollments")
          .upsert(
            { user_id: user.id, course_id: typedCourse.id },
            { onConflict: "user_id,course_id" }
          );
        if (!enrollErr) {
          await admin.from("course_invites").delete().eq("id", pendingInvite.id);
          isEnrolled = true;
        } else {
          console.error("[course-page] auto-enroll failed:", enrollErr);
        }
      }
    }

    if (isEnrolled) {
      const sidebarData = await getCourseSidebarData(supabase, typedCourse, user.id);
      completedLessonIds = sidebarData.completedLessonIds;
      sidebarQuizByModule = sidebarData.quizByModule;
      sidebarPassedQuizIds = sidebarData.passedQuizIds;

      for (const mod of typedCourse.modules) {
        for (const lesson of mod.lessons) {
          if (!completedLessonIds.has(lesson.id)) {
            nextLessonSlug = lesson.slug;
            break;
          }
        }
        if (nextLessonSlug) break;
      }
    }
  }

  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const moduleIds = typedCourse.modules.map((m) => m.id);
  const { data: moduleQuizzes } = await supabase
    .from("module_quizzes")
    .select("id, module_id, xp_reward")
    .in("module_id", moduleIds);

  const quizByModule = new Map<string, { id: string; xp_reward: number }>();
  if (moduleQuizzes) {
    for (const q of moduleQuizzes) quizByModule.set(q.module_id, { id: q.id, xp_reward: q.xp_reward });
  }

  const passedQuizIds = new Set<string>();
  if (user && moduleQuizzes && moduleQuizzes.length > 0) {
    const quizIds = moduleQuizzes.map((q) => q.id);
    const { data: quizResults } = await supabase
      .from("module_quiz_results")
      .select("module_quiz_id, passed")
      .eq("user_id", user.id)
      .eq("passed", true)
      .in("module_quiz_id", quizIds);

    if (quizResults) {
      for (const r of quizResults) passedQuizIds.add(r.module_quiz_id);
    }
  }

  const totalMinutes = typedCourse.modules.reduce((sum, mod) => {
    return sum + mod.lessons.reduce((s, l) => s + estimateLessonMinutes(l), 0) + (quizByModule.has(mod.id) ? 3 : 0);
  }, 0);

  return (
    <div className="flex min-h-screen">
      {isEnrolled && (
        <CourseSidebar
          course={typedCourse}
          slug={slug}
          activeLessonId={null}
          completedLessonIds={completedLessonIds}
          quizByModule={sidebarQuizByModule}
          passedQuizIds={sidebarPassedQuizIds}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary">{typedCourse.is_free ? "Free" : `$${typedCourse.price}`}</Badge>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                typedCourse.level === "entry"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : typedCourse.level === "advanced"
                  ? "bg-red-500/10 text-red-400"
                  : "bg-amber-500/10 text-amber-400"
              }`}>
                {typedCourse.level === "entry" ? "Entry Level" : typedCourse.level === "advanced" ? "Advanced" : "Intermediate"}
              </span>
              <span className="text-sm text-neutral-400">{totalLessons} lessons</span>
              <span className="text-sm text-neutral-400 flex items-center gap-1">
                <Clock className="size-3.5" />
                {formatDuration(totalMinutes)}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">{typedCourse.title}</h1>
            <p className="mt-3 text-lg text-neutral-400">{typedCourse.description}</p>

            <div className="mt-6">
              {isEnrolled ? (
                <div className="space-y-4">
                  <CourseProgress value={progressPercent} label="Course Progress" display={`${completedCount}/${totalLessons} lessons`} />
                  {nextLessonSlug ? (
                    <Link
                      href={`/courses/${slug}/lessons/${nextLessonSlug}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                    >
                      <PlayCircle className="size-4" />
                      Continue Learning
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-green-400">
                      <CheckCircle2 className="mr-1 inline size-4" />
                      Course completed!
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={`/train-to-be-sharp/${PURCHASE_ROUTING_SLUG[typedCourse.slug] ?? typedCourse.slug}`}
                    className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
                  >
                    <Lock className="size-4" />
                    Enroll{typedCourse.is_free ? "" : ` — $${typedCourse.price}`}
                  </Link>
                  <p className="text-xs text-neutral-400">
                    Already purchased with this email? Access unlocks automatically when you sign in — or <a href="mailto:info@coveblades.com" className="underline hover:text-neutral-200">contact us</a>.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Course Content</h2>
            {typedCourse.modules.map((mod, modIndex) => {
              const modLessonIds = mod.lessons.map((l) => l.id);
              const modCompleted = modLessonIds.filter((id) => completedLessonIds.has(id)).length;
              const modMinutes = mod.lessons.reduce((s, l) => s + estimateLessonMinutes(l), 0) + (quizByModule.has(mod.id) ? 3 : 0);
              const isCertMod = mod.slug === "remote-certification";

              return (
                <Card key={mod.id} className={isCertMod ? "border-[#D4A017]/40" : undefined}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={isCertMod ? "flex items-center gap-2 text-[#D4A017]" : undefined}>
                        {isCertMod && <Award className="size-5" />}
                        Module {modIndex + 1}: {mod.title}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="size-3" />
                          {formatDuration(modMinutes)}
                        </span>
                        {isEnrolled && (
                          <span className="text-xs text-neutral-400">{modCompleted}/{mod.lessons.length} complete</span>
                        )}
                      </div>
                    </div>
                    {mod.description && <p className="text-sm text-neutral-400">{mod.description}</p>}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {mod.lessons.map((lesson) => {
                        const isComplete = completedLessonIds.has(lesson.id);
                        const lessonMins = estimateLessonMinutes(lesson);
                        return (
                          <li key={lesson.id}>
                            {isEnrolled ? (
                              <Link
                                href={`/courses/${slug}/lessons/${lesson.slug}`}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-800",
                                  isComplete
                                    ? "text-neutral-500"
                                    : lesson.slug === "practicum-remote-certification"
                                      ? "border border-[#D4A017]/40 bg-[#D4A017]/10 font-semibold text-[#D4A017] hover:bg-[#D4A017]/20"
                                      : "text-neutral-200"
                                )}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                                ) : lesson.slug === "practicum-remote-certification" ? (
                                  <Award className="size-4 shrink-0 text-[#D4A017]" />
                                ) : (
                                  <BookOpen className="size-4 shrink-0 text-neutral-500" />
                                )}
                                <span className="flex-1">{lesson.title}</span>
                                <span className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Clock className="size-3" />
                                  {lessonMins} min
                                </span>
                                <ChevronRight className="size-4 text-neutral-600" />
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-500">
                                {lesson.slug === "practicum-remote-certification" ? (
                                  <Award className="size-4 shrink-0 text-[#D4A017]" />
                                ) : (
                                  <BookOpen className="size-4 shrink-0" />
                                )}
                                <span className="flex-1">{lesson.title}</span>
                                <span className="flex items-center gap-1 text-xs">
                                  <Clock className="size-3" />
                                  {lessonMins} min
                                </span>
                              </div>
                            )}
                          </li>
                        );
                      })}

                      {quizByModule.has(mod.id) && (() => {
                        const quiz = quizByModule.get(mod.id)!;
                        const isPassed = passedQuizIds.has(quiz.id);
                        const allModLessonsComplete = modCompleted === mod.lessons.length;
                        return (
                          <li>
                            {isEnrolled && allModLessonsComplete ? (
                              <Link
                                href={`/courses/${slug}/quiz/${mod.slug}`}
                                className={cn(
                                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-neutral-800",
                                  isPassed && "text-neutral-500"
                                )}
                              >
                                {isPassed ? (
                                  <Trophy className="size-4 shrink-0 text-amber-500" />
                                ) : (
                                  <Zap className="size-4 shrink-0 text-emerald-400" />
                                )}
                                <span className="flex-1 font-medium">Module Quiz</span>
                                <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                                  +{quiz.xp_reward} XP
                                </Badge>
                                {isPassed ? (
                                  <CheckCircle2 className="size-4 text-green-500" />
                                ) : (
                                  <ChevronRight className="size-4 text-neutral-600" />
                                )}
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-600">
                                <Lock className="size-4 shrink-0" />
                                <span className="flex-1 font-medium">Module Quiz</span>
                                <Badge variant="outline" className="text-[10px] opacity-50">+{quiz.xp_reward} XP</Badge>
                              </div>
                            )}
                          </li>
                        );
                      })()}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
