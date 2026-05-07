import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { CourseProgress } from "@/components/courses/course-progress";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import type { CourseWithModules } from "@/lib/types/database";

export default async function DashboardCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("course_id, courses(id, title, slug, description, level, modules(id, title, lessons(id)))")
    .eq("user_id", user.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));

  const courses = (enrollments ?? []).map((e: any) => {
    const course = e.courses;
    const totalLessons = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length ?? 0), 0) ?? 0;
    const completedLessons = course.modules?.reduce((sum: number, m: any) =>
      sum + (m.lessons?.filter((l: any) => completedIds.has(l.id)).length ?? 0), 0) ?? 0;
    const moduleCount = course.modules?.length ?? 0;
    return { ...course, totalLessons, completedLessons, moduleCount };
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">My Courses</h1>
        <Link href="/courses" className="text-sm text-emerald-400 hover:underline">Browse all →</Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <BookOpen className="mx-auto size-10 text-neutral-600 mb-3" />
            <p className="text-neutral-400 mb-4">No courses yet. Start learning today!</p>
            <Link href="/courses" className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600">
              Browse Courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courses.map((course: any) => {
            const percent = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
            return (
              <Link key={course.id} href={`/courses/${course.slug}`} className="block group">
                <Card className="transition-all hover:border-emerald-500/50">
                  <CardContent className="py-5">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-1">{course.description}</p>
                      </div>
                      <ChevronRight className="size-5 text-neutral-500 shrink-0 mt-1" />
                    </div>
                    <div className="flex items-center gap-4 mt-3 mb-3 text-xs text-neutral-500">
                      <span>{course.moduleCount} modules</span>
                      <span>{course.totalLessons} lessons</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        course.level === "entry" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>{course.level}</span>
                    </div>
                    <CourseProgress value={percent} label="" display={`${course.completedLessons}/${course.totalLessons} complete · ${percent}%`} />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
