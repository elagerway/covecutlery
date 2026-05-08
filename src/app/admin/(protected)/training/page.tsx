import { createAdminClient } from "@/utils/supabase/admin";
import { TrainingInviteForm } from "@/components/admin/TrainingInviteForm";
import { TrainingRoster } from "@/components/admin/TrainingRoster";

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
    supabase.from("courses").select("id, title, slug, modules(id, lessons(id))"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);
  const emailMap = new Map<string, string>();
  const bannedSet = new Set<string>();
  for (const u of authData?.users ?? []) {
    emailMap.set(u.id, u.email ?? "");
    if (u.banned_until && new Date(u.banned_until) > new Date()) bannedSet.add(u.id);
  }

  const totalQuizzes = allQuizzes?.length ?? 0;
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

  const totalLessons = (courses ?? []).reduce((sum: number, c: any) =>
    sum + (c.modules?.reduce((s: number, m: any) => s + (m.lessons?.length ?? 0), 0) ?? 0), 0);

  const students: any[] = [];
  const seen = new Set<string>();
  for (const e of enrollments ?? []) {
    if (seen.has(e.user_id)) continue;
    seen.add(e.user_id);
    const profile = profileMap.get(e.user_id);
    const completedLessons = progressByUser.get(e.user_id)?.size ?? 0;
    const userQuizResults = quizResultsByUser.get(e.user_id) ?? [];
    const passedQuizzes = userQuizResults.filter((r: any) => r.passed).length;

    students.push({
      user_id: e.user_id,
      email: emailMap.get(e.user_id) ?? "",
      full_name: profile?.full_name || "Unknown",
      enrolled_at: e.enrolled_at,
      xp: profile?.xp ?? 0,
      level: profile?.level ?? 1,
      completed_lessons: completedLessons,
      total_lessons: totalLessons,
      passed_quizzes: passedQuizzes,
      total_quizzes: totalQuizzes,
      banned: bannedSet.has(e.user_id),
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

      <TrainingInviteForm courses={(courses ?? []).map((c: any) => ({ id: c.id, title: c.title }))} />

      <TrainingRoster students={students} wrongAnswers={wrongAnswers} courseSlug={courseSlug} />
    </div>
  );
}
