import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseProgress } from "@/components/courses/course-progress";
import { BookOpen, ChevronRight, Trophy, Star, Flame } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, xp, level, streak_days")
    .eq("user_id", user.id)
    .single();

  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("course_id, courses(id, title, slug, modules(id, lessons(id)))")
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
    return { ...course, totalLessons, completedLessons };
  });

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Student";

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {displayName}</h1>
      <p className="text-neutral-400 text-sm mb-8">Pick up where you left off.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{profile?.xp ?? 0}</p>
              <p className="text-xs text-neutral-400">Total XP</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <Star className="size-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Level {profile?.level ?? 1}</p>
              <p className="text-xs text-neutral-400">Current Level</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Flame className="size-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{profile?.streak_days ?? 0} days</p>
              <p className="text-xs text-neutral-400">Streak</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Courses</h2>
        <Link href="/courses" className="text-sm text-emerald-400 hover:underline">Browse all →</Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <BookOpen className="mx-auto size-10 text-neutral-600 mb-3" />
            <p className="text-neutral-400 mb-4">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses" className="inline-flex h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-medium text-white hover:bg-emerald-600">
              Browse Courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {courses.map((course: any) => {
            const percent = course.totalLessons > 0 ? Math.round((course.completedLessons / course.totalLessons) * 100) : 0;
            return (
              <Link key={course.id} href={`/courses/${course.slug}`} className="block group">
                <Card className="transition-all hover:border-emerald-500/50">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">{course.title}</h3>
                      <ChevronRight className="size-4 text-neutral-500" />
                    </div>
                    <CourseProgress value={percent} label="" display={`${course.completedLessons}/${course.totalLessons} lessons · ${percent}%`} />
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
