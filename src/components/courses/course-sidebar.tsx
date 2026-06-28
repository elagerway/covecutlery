import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronLeft, Zap, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CourseWithModules } from "@/lib/types/database";

interface CourseSidebarProps {
  course: CourseWithModules;
  slug: string;
  activeLessonId?: string | null;
  completedLessonIds: Set<string>;
  quizByModule: Map<string, string>;
  passedQuizIds: Set<string>;
}

export function CourseSidebar({
  course,
  slug,
  activeLessonId,
  completedLessonIds,
  quizByModule,
  passedQuizIds,
}: CourseSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 lg:flex">
      <div className="border-b border-neutral-800 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-white">
            <span className="text-xs font-bold text-black">CB</span>
          </div>
          <span className="text-[13px] font-semibold text-white">Cove Blades Training</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Link
          href="/dashboard/courses"
          className="mb-4 flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
        >
          <ChevronLeft className="size-4" />
          My Courses
        </Link>

        <h3 className="mb-3 text-sm font-semibold text-white">{course.title}</h3>

        <nav className="space-y-4">
          {course.modules.map((mod) => {
            const isCertMod = mod.slug === "remote-certification";
            return (
            <div key={mod.id}>
              <p
                className={cn(
                  "mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider",
                  isCertMod ? "font-semibold text-[#D4A017]" : "font-medium text-neutral-500"
                )}
              >
                {isCertMod && <Award className="size-3.5" />}
                {mod.title}
              </p>
              <ul className="space-y-0.5">
                {mod.lessons.map((lesson) => {
                  const isActive = lesson.id === activeLessonId;
                  const isComplete = completedLessonIds.has(lesson.id);
                  const isCert = lesson.slug === "practicum-remote-certification";
                  return (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${slug}/lessons/${lesson.slug}`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-emerald-500/10 font-medium text-emerald-400"
                            : isCert
                              ? "border border-[#D4A017]/40 bg-[#D4A017]/10 font-semibold text-[#D4A017] hover:bg-[#D4A017]/20"
                              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="size-3.5 shrink-0 text-green-500" />
                        ) : isCert ? (
                          <Award className="size-3.5 shrink-0 text-[#D4A017]" />
                        ) : (
                          <BookOpen className="size-3.5 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </Link>
                    </li>
                  );
                })}
                {quizByModule.has(mod.id) && (() => {
                  const quizId = quizByModule.get(mod.id)!;
                  const isPassed = passedQuizIds.has(quizId);
                  return (
                    <li>
                      <Link
                        href={`/courses/${slug}/quiz/${mod.slug}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                      >
                        {isPassed ? (
                          <Trophy className="size-3.5 shrink-0 text-amber-500" />
                        ) : (
                          <Zap className="size-3.5 shrink-0 text-emerald-400" />
                        )}
                        <span className="truncate font-medium">Quiz</span>
                      </Link>
                    </li>
                  );
                })()}
              </ul>
            </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
