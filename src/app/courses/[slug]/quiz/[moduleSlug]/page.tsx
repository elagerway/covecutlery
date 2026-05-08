import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ModuleQuiz } from "@/components/gamification/module-quiz";
import { ChevronLeft, Trophy, Lock, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import type { ModuleQuiz as ModuleQuizType, CourseWithModules } from "@/lib/types/database";

interface QuizPageProps {
  params: Promise<{ slug: string; moduleSlug: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug, moduleSlug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?redirect=/courses/${slug}/quiz/${moduleSlug}`);

  const { data: course } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const typedCourse = course as CourseWithModules;
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({ ...mod, lessons: mod.lessons.sort((a, b) => a.order - b.order) }));

  const currentModule = typedCourse.modules.find((m) => m.slug === moduleSlug);
  if (!currentModule) notFound();

  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("course_id", typedCourse.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!enrollment) redirect(`/courses/${slug}`);

  const lessonIds = currentModule.lessons.map((l) => l.id);
  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true)
    .in("lesson_id", lessonIds);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const completedCount = lessonIds.filter((id) => completedIds.has(id)).length;
  const allLessonsComplete = completedCount === lessonIds.length;

  const { data: quiz } = await supabase
    .from("module_quizzes")
    .select("*")
    .eq("module_id", currentModule.id)
    .maybeSingle();

  if (!quiz) notFound();

  const { data: result } = await supabase
    .from("module_quiz_results")
    .select("passed, score, total, xp_earned, answers")
    .eq("module_quiz_id", quiz.id)
    .eq("user_id", user.id)
    .maybeSingle();

  const alreadyPassed = result?.passed ?? false;
  const questions = (quiz as ModuleQuizType).questions;
  const storedAnswers = result?.answers as number[] | null;
  const userAnswers = storedAnswers ?? (result?.score === result?.total ? questions.map(q => Number(q.correct)) : []);

  const currentModuleIndex = typedCourse.modules.findIndex((m) => m.id === currentModule.id);
  const nextModule = typedCourse.modules[currentModuleIndex + 1];
  const nextLessonUrl = nextModule?.lessons?.[0]
    ? `/courses/${slug}/lessons/${nextModule.lessons[0].slug}`
    : `/courses/${slug}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
      <Link
        href={`/courses/${slug}`}
        className="mb-8 inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-white"
      >
        <ChevronLeft className="size-4" />
        Back to {typedCourse.title}
      </Link>

      {!allLessonsComplete ? (
        <div className="text-center">
          <Lock className="mx-auto size-12 text-neutral-500" />
          <h1 className="mt-4 text-2xl font-bold text-white">Complete the lessons first</h1>
          <p className="mx-auto mt-2 max-w-md text-neutral-400">
            Finish all lessons in <strong className="text-white">{currentModule.title}</strong> to unlock this quiz.
          </p>
          <div className="mx-auto mt-6 max-w-xs">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-neutral-400">{completedCount} of {lessonIds.length} lessons</span>
              <span className="font-medium text-white">{Math.round((completedCount / lessonIds.length) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${(completedCount / lessonIds.length) * 100}%` }} />
            </div>
          </div>
          {(() => {
            const firstIncomplete = currentModule.lessons.find((l) => !completedIds.has(l.id));
            return firstIncomplete ? (
              <div className="mt-8">
                <Link href={`/courses/${slug}/lessons/${firstIncomplete.slug}`}>
                  <Button size="lg">
                    <BookOpen className="size-4" />
                    Continue Learning
                  </Button>
                </Link>
              </div>
            ) : null;
          })()}
        </div>
      ) : alreadyPassed ? (
        <div>
          <div className="mb-8 text-center">
            <Trophy className="mx-auto size-16 text-amber-500" />
            <h1 className="mt-4 text-3xl font-bold text-white">Quiz Complete!</h1>
            <p className="mt-2 text-lg text-neutral-400">
              You scored {result?.score}/{result?.total} on the {currentModule.title} quiz
            </p>
            <p className="mt-1 font-semibold text-emerald-400">+{result?.xp_earned || quiz.xp_reward} XP earned</p>
          </div>

          <div className="space-y-6">
            {questions.map((q, i) => {
              const userAnswer = userAnswers[i] ?? -1;
              const isCorrect = userAnswer === Number(q.correct);
              return (
                <div key={i} className="rounded-xl border border-neutral-800 p-5">
                  <div className="mb-3 flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                    ) : (
                      <XCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
                    )}
                    <p className="font-medium text-white">{q.question}</p>
                  </div>
                  <div className="ml-7 space-y-2">
                    {q.options.map((option, j) => {
                      const isUserChoice = j === userAnswer;
                      const isCorrectAnswer = j === Number(q.correct);
                      let classes = "rounded-lg border px-3 py-2 text-sm ";
                      if (isCorrectAnswer) classes += "border-green-500/50 bg-green-500/10 text-green-400";
                      else if (isUserChoice) classes += "border-red-500/50 bg-red-500/10 text-red-400 line-through";
                      else classes += "border-neutral-800 text-neutral-500";
                      return (
                        <div key={j} className={classes}>
                          <span className="mr-2 font-medium">{String.fromCharCode(65 + j)}.</span>
                          {option}
                          {isCorrectAnswer && <span className="ml-2 text-xs font-medium">(correct)</span>}
                          {isUserChoice && !isCorrectAnswer && <span className="ml-2 text-xs font-medium">(your answer)</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={nextLessonUrl}>
              <Button size="lg">{nextModule ? "Continue to Next Module" : "Back to Course"}</Button>
            </Link>
          </div>
        </div>
      ) : (
        <ModuleQuiz quiz={quiz as ModuleQuizType} moduleTitle={currentModule.title} courseSlug={slug} nextLessonUrl={nextLessonUrl} />
      )}
    </div>
  );
}
