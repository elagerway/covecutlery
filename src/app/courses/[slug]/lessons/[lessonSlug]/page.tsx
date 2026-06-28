import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LessonCompleteButton } from "@/components/courses/lesson-complete-button";
import { LessonContent } from "@/components/courses/lesson-content";
import { VideoWithChapters } from "@/components/courses/video-with-chapters";
import { PracticumSubmission } from "@/components/courses/practicum-submission";
import { CourseSidebar } from "@/components/courses/course-sidebar";
import { getCourseSidebarData } from "@/lib/course-sidebar-data";
import { ChevronLeft, ChevronRight, Clock, FileText, Zap } from "lucide-react";
import type { CourseWithModules, Lesson, UserProgress } from "@/lib/types/database";

interface LessonPageProps {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("*, modules(*, lessons(*))")
    .eq("slug", slug)
    .single();

  if (courseError || !course) notFound();

  const typedCourse = course as CourseWithModules;
  typedCourse.modules = typedCourse.modules
    .sort((a, b) => a.order - b.order)
    .map((mod) => ({ ...mod, lessons: mod.lessons.sort((a, b) => a.order - b.order) }));

  let currentLesson: Lesson | null = null;
  let currentModuleTitle = "";
  let currentModuleId = "";
  let currentModuleSlug = "";
  let isLastLessonInModule = false;

  for (const mod of typedCourse.modules) {
    const found = mod.lessons.find((l) => l.slug === lessonSlug);
    if (found) {
      currentLesson = found;
      currentModuleTitle = mod.title;
      currentModuleId = mod.id;
      currentModuleSlug = mod.slug;
      isLastLessonInModule = mod.lessons[mod.lessons.length - 1]?.id === found.id;
      break;
    }
  }

  if (!currentLesson) notFound();

  const allLessons = typedCourse.modules.flatMap((mod) => mod.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson!.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?redirect=/courses/${slug}/lessons/${lessonSlug}`);

  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("course_id", typedCourse.id)
    .eq("user_id", user.id)
    .maybeSingle();

  // Enrollment is granted only via paid checkout (Stripe webhook / login backfill)
  // or an invite. Without it, send the user to the course overview to enroll/pay.
  if (!enrollment) {
    redirect(`/courses/${slug}`);
  }

  const { completedLessonIds, quizByModule, passedQuizIds } = await getCourseSidebarData(supabase, typedCourse, user.id);
  const isCurrentLessonComplete = completedLessonIds.has(currentLesson.id);

  let moduleQuiz = null;
  let quizAlreadyPassed = false;
  if (isLastLessonInModule) {
    const { data: quiz } = await supabase
      .from("module_quizzes")
      .select("*")
      .eq("module_id", currentModuleId)
      .maybeSingle();

    if (quiz) {
      moduleQuiz = quiz;
      const { data: result } = await supabase
        .from("module_quiz_results")
        .select("passed")
        .eq("module_quiz_id", quiz.id)
        .eq("user_id", user.id)
        .maybeSingle();
      quizAlreadyPassed = result?.passed ?? false;
    }
  }

  return (
    <div className="flex min-h-screen">
      <CourseSidebar
        course={typedCourse}
        slug={slug}
        activeLessonId={currentLesson.id}
        completedLessonIds={completedLessonIds}
        quizByModule={quizByModule}
        passedQuizIds={passedQuizIds}
      />

      <main className="flex-1 overflow-y-auto bg-neutral-950">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
          <div className="mb-6 flex items-center gap-2 text-sm text-neutral-400">
            <Link href={`/courses/${slug}`} className="hover:text-white">{typedCourse.title}</Link>
            <ChevronRight className="size-3" />
            <span>{currentModuleTitle}</span>
            <ChevronRight className="size-3" />
            <span className="text-white">{currentLesson.title}</span>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <Badge variant="outline">
                <FileText className="size-4" />
                <span className="ml-1">{currentLesson.content_type}</span>
              </Badge>
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock className="size-3" />
                {Math.max(1, Math.ceil((currentLesson.content ?? "").split(/\s+/).length / 200))} min
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{currentLesson.title}</h1>
          </div>

          {currentLesson.content_type === "video" &&
            currentLesson.video_url &&
            /(?:youtube\.com|youtu\.be)/.test(currentLesson.video_url) && (
              <VideoWithChapters videoUrl={currentLesson.video_url} />
            )}

          <LessonContent content={currentLesson.content} contentType={currentLesson.content_type} title={currentLesson.title} />

          {currentLesson.slug === "practicum-remote-certification" && (
            <PracticumSubmission courseSlug={slug} />
          )}

          <div className="border-t border-neutral-800 pt-6">
            <div className="mb-6">
              <LessonCompleteButton lessonId={currentLesson.id} isCompleted={isCurrentLessonComplete} />
            </div>

            {!isCurrentLessonComplete ? (
              <p className="text-sm text-neutral-400">Mark this lesson as complete to continue.</p>
            ) : (
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Link href={`/courses/${slug}/lessons/${prevLesson.slug}`}>
                    <Button variant="outline" size="lg">
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {isLastLessonInModule && moduleQuiz && !quizAlreadyPassed ? (
                  <Link href={`/courses/${slug}/quiz/${currentModuleSlug}`}>
                    <Button size="lg">
                      <Zap className="size-4" />
                      Take Module Quiz
                    </Button>
                  </Link>
                ) : nextLesson ? (
                  <Link href={`/courses/${slug}/lessons/${nextLesson.slug}`}>
                    <Button size="lg">
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/courses/${slug}`}>
                    <Button size="lg">
                      Back to Course
                      <ChevronRight className="size-4" />
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
