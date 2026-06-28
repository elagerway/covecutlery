import { createAdminClient } from "@/utils/supabase/admin";
import { TrainingInviteForm } from "@/components/admin/TrainingInviteForm";
import { TrainingRoster } from "@/components/admin/TrainingRoster";
import { EnrollmentToggles } from "@/components/admin/EnrollmentToggles";
import { PracticumSubmissions } from "@/components/admin/PracticumSubmissions";

export default async function TrainingAdminPage() {
  const supabase = createAdminClient();

  const [
    { data: enrollments },
    { data: profiles },
    { data: allProgress },
    { data: allQuizResults },
    { data: allQuizzes },
    { data: allModules },
    { data: courses },
    { data: authData },
  ] = await Promise.all([
    supabase.from("user_enrollments").select("user_id, enrolled_at, course_id").order("enrolled_at", { ascending: false }),
    supabase.from("profiles").select("user_id, full_name, xp, level"),
    supabase.from("user_progress").select("user_id, lesson_id, completed").eq("completed", true),
    supabase.from("module_quiz_results").select("user_id, module_quiz_id, score, total, passed, answers, completed_at"),
    supabase.from("module_quizzes").select("id, module_id, questions"),
    supabase.from("modules").select("id, title, slug, course_id").order("order"),
    supabase.from("courses").select("id, title, slug, price, enrollment_open, modules(id, lessons(id))").order("order"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const emailMap = new Map<string, string>();
  const bannedSet = new Set<string>();
  for (const u of authData?.users ?? []) {
    emailMap.set(u.id, u.email ?? "");
    if (u.banned_until && new Date(u.banned_until) > new Date()) bannedSet.add(u.id);
  }

  const profileMap = new Map<string, any>();
  for (const p of profiles ?? []) profileMap.set(p.user_id, p);

  const progressByUser = new Map<string, Set<string>>();
  for (const p of allProgress ?? []) {
    if (!progressByUser.has(p.user_id)) progressByUser.set(p.user_id, new Set());
    progressByUser.get(p.user_id)!.add(p.lesson_id);
  }

  const quizResultsByUser = new Map<string, any[]>();
  for (const r of allQuizResults ?? []) {
    if (!quizResultsByUser.has(r.user_id)) quizResultsByUser.set(r.user_id, []);
    quizResultsByUser.get(r.user_id)!.push(r);
  }

  const quizMap = new Map<string, any>();
  for (const q of allQuizzes ?? []) quizMap.set(q.id, q);

  const moduleMap = new Map<string, any>();
  for (const m of allModules ?? []) moduleMap.set(m.id, m);

  // Per-course lesson + quiz ids, so each student's denominator only counts
  // content from the courses they're actually enrolled in.
  const lessonIdsByCourse = new Map<string, Set<string>>();
  for (const c of courses ?? []) {
    const ids = new Set<string>();
    for (const m of c.modules ?? []) {
      for (const l of m.lessons ?? []) ids.add(l.id);
    }
    lessonIdsByCourse.set(c.id, ids);
  }
  const quizIdsByCourse = new Map<string, Set<string>>();
  for (const q of allQuizzes ?? []) {
    const m = moduleMap.get(q.module_id);
    if (!m) continue;
    if (!quizIdsByCourse.has(m.course_id)) quizIdsByCourse.set(m.course_id, new Set());
    quizIdsByCourse.get(m.course_id)!.add(q.id);
  }

  // Group enrollments by user (a student may be enrolled in more than one
  // course). `enrollments` is already ordered enrolled_at desc, so the first
  // entry we see for a user is also their most-recent enrollment.
  const enrollmentsByUser = new Map<string, { courseIds: Set<string>; mostRecent: string }>();
  for (const e of enrollments ?? []) {
    const existing = enrollmentsByUser.get(e.user_id);
    if (existing) {
      existing.courseIds.add(e.course_id);
    } else {
      enrollmentsByUser.set(e.user_id, { courseIds: new Set([e.course_id]), mostRecent: e.enrolled_at });
    }
  }

  const students: any[] = [];
  for (const [userId, { courseIds, mostRecent }] of enrollmentsByUser) {
    const profile = profileMap.get(userId);

    // Union the lesson / quiz id sets for everything this student is enrolled in.
    const enrolledLessonIds = new Set<string>();
    const enrolledQuizIds = new Set<string>();
    for (const cId of courseIds) {
      for (const lId of lessonIdsByCourse.get(cId) ?? []) enrolledLessonIds.add(lId);
      for (const qId of quizIdsByCourse.get(cId) ?? []) enrolledQuizIds.add(qId);
    }

    const userProgress = progressByUser.get(userId) ?? new Set<string>();
    let completedLessons = 0;
    for (const lId of userProgress) if (enrolledLessonIds.has(lId)) completedLessons++;

    const userQuizResults = quizResultsByUser.get(userId) ?? [];
    const passedQuizzes = userQuizResults.filter((r: any) => r.passed && enrolledQuizIds.has(r.module_quiz_id)).length;

    students.push({
      user_id: userId,
      email: emailMap.get(userId) ?? "",
      full_name: profile?.full_name || "Unknown",
      enrolled_at: mostRecent,
      xp: profile?.xp ?? 0,
      level: profile?.level ?? 1,
      completed_lessons: completedLessons,
      total_lessons: enrolledLessonIds.size,
      passed_quizzes: passedQuizzes,
      total_quizzes: enrolledQuizIds.size,
      banned: bannedSet.has(userId),
    });
  }

  const courseSlug = (courses ?? [])[0]?.slug ?? "train-to-be-sharp";

  const wrongAnswers: any[] = [];
  for (const r of allQuizResults ?? []) {
    const quiz = quizMap.get(r.module_quiz_id);
    if (!quiz || !r.answers) continue;
    const questions = quiz.questions as Array<{ question: string; options: string[]; correct: number }>;
    const answers = r.answers as number[];
    const mod = moduleMap.get(quiz.module_id);

    for (let i = 0; i < questions.length; i++) {
      if (answers[i] !== undefined && answers[i] !== questions[i].correct) {
        wrongAnswers.push({
          userId: r.user_id,
          moduleName: mod?.title ?? "Unknown",
          moduleSlug: mod?.slug ?? "",
          question: questions[i].question,
          userAnswer: questions[i].options[answers[i]] ?? "N/A",
          correctAnswer: questions[i].options[questions[i].correct],
        });
      }
    }
  }

  const completedCourse = students.filter(s => s.completed_lessons >= s.total_lessons && s.passed_quizzes >= s.total_quizzes && s.total_lessons > 0).length;
  const inProgress = students.filter(s => (s.completed_lessons > 0 || s.passed_quizzes > 0) && (s.completed_lessons < s.total_lessons || s.passed_quizzes < s.total_quizzes)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Training</h1>
      <p className="text-sm text-neutral-400 mb-6">Student enrollment, progress, and quiz performance.</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
          <p className="text-2xl font-bold text-white">{students.length}</p>
          <p className="text-xs text-neutral-400">Total Students</p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
          <p className="text-2xl font-bold text-emerald-400">{completedCourse}</p>
          <p className="text-xs text-neutral-400">Completed Course</p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
          <p className="text-2xl font-bold text-amber-400">{inProgress}</p>
          <p className="text-xs text-neutral-400">In Progress</p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
          <p className="text-2xl font-bold text-red-400">{wrongAnswers.length}</p>
          <p className="text-xs text-neutral-400">Wrong Answers</p>
        </div>
      </div>

      <PracticumSubmissions />

      <EnrollmentToggles
        initial={(courses ?? []).map((c: any) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          price: c.price,
          enrollment_open: c.enrollment_open,
        }))}
      />

      <TrainingInviteForm courses={(courses ?? []).map((c: any) => ({ id: c.id, title: c.title }))} />

      <TrainingRoster
        students={students}
        wrongAnswers={wrongAnswers}
        courseSlug={courseSlug}
        courseOptions={(courses ?? []).map((c: any) => ({ id: c.id, title: c.title }))}
      />
    </div>
  );
}
