"use client";

import { useState, useMemo } from "react";

interface StudentRow {
  user_id: string;
  email: string;
  full_name: string;
  enrolled_at: string;
  xp: number;
  level: number;
  completed_lessons: number;
  total_lessons: number;
  passed_quizzes: number;
  total_quizzes: number;
  banned: boolean;
}

interface WrongAnswer {
  userId: string;
  moduleName: string;
  moduleSlug: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

interface Props {
  students: StudentRow[];
  wrongAnswers: WrongAnswer[];
  courseSlug: string;
}

function getProgress(s: StudentRow) {
  const lessonPct = s.total_lessons > 0 ? Math.round((s.completed_lessons / s.total_lessons) * 100) : 0;
  const quizPct = s.total_quizzes > 0 ? Math.round((s.passed_quizzes / s.total_quizzes) * 100) : 0;
  const overallPct = Math.round((lessonPct + quizPct) / 2);
  const isComplete = s.completed_lessons >= s.total_lessons && s.passed_quizzes >= s.total_quizzes && s.total_lessons > 0;
  return { lessonPct, quizPct, overallPct, isComplete };
}

export function TrainingRoster({ students: initial, wrongAnswers, courseSlug }: Props) {
  const [students, setStudents] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [suspending, setSuspending] = useState(false);
  const [suspendError, setSuspendError] = useState<string | null>(null);

  const selected = selectedId ? students.find((s) => s.user_id === selectedId) : null;
  const selectedWrong = selectedId ? wrongAnswers.filter((w) => w.userId === selectedId) : [];

  const wrongCountByUser = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of wrongAnswers) {
      map.set(w.userId, (map.get(w.userId) ?? 0) + 1);
    }
    return map;
  }, [wrongAnswers]);

  async function handleSuspend(userId: string, suspend: boolean) {
    setSuspending(true);
    setSuspendError(null);
    try {
      const res = await fetch("/api/admin/training/suspend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, suspend }),
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.user_id === userId ? { ...s, banned: suspend } : s))
        );
      } else {
        const data = await res.json();
        setSuspendError(data.error || "Failed to update");
      }
    } catch {
      setSuspendError("Failed to update");
    }
    setSuspending(false);
  }

  if (selected) {
    const { overallPct, isComplete } = getProgress(selected);

    return (
      <div>
        <button
          onClick={() => { setSelectedId(null); setSuspendError(null); }}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          All Students
        </button>

        <div className="rounded-lg border p-6 mb-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">{selected.full_name || "—"}</h2>
              <p className="text-sm text-neutral-400 mt-0.5">{selected.email}</p>
              {selected.banned && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 mt-2">
                  Suspended
                </span>
              )}
            </div>
            <button
              onClick={() => handleSuspend(selected.user_id, !selected.banned)}
              disabled={suspending}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: selected.banned ? "#161B22" : "#dc2626",
                color: selected.banned ? "#4ade80" : "#fff",
                border: selected.banned ? "1px solid #30363D" : "none",
              }}
            >
              {suspending ? "..." : selected.banned ? "Unsuspend" : "Suspend"}
            </button>
          </div>
          {suspendError && <p className="mt-3 text-sm text-red-400">{suspendError}</p>}

          <div className="grid grid-cols-5 gap-4 mt-6">
            <div>
              <p className="text-xs text-neutral-500">Enrolled</p>
              <p className="text-sm text-white mt-0.5">{new Date(selected.enrolled_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Lessons</p>
              <p className="text-sm mt-0.5">
                <span className="text-white">{selected.completed_lessons}</span>
                <span className="text-neutral-500">/{selected.total_lessons}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Quizzes</p>
              <p className="text-sm mt-0.5">
                <span className={selected.passed_quizzes >= selected.total_quizzes ? "text-emerald-400" : "text-white"}>{selected.passed_quizzes}</span>
                <span className="text-neutral-500">/{selected.total_quizzes}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">XP</p>
              <p className="text-sm text-amber-400 font-medium mt-0.5">{selected.xp}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Level</p>
              <p className="text-sm text-white mt-0.5">{selected.level}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-neutral-800 max-w-[240px]">
                <div
                  className={`h-2 rounded-full ${isComplete ? "bg-emerald-500" : overallPct > 0 ? "bg-amber-500" : "bg-neutral-700"}`}
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <span className="text-sm text-neutral-400">{overallPct}% complete</span>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white mb-4">
          Wrong Answers
          {selectedWrong.length > 0 && (
            <span className="ml-2 text-sm font-normal text-neutral-500">({selectedWrong.length})</span>
          )}
        </h3>
        {selectedWrong.length === 0 ? (
          <div className="rounded-lg border p-6 text-center" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
            <p className="text-neutral-500 text-sm">No wrong answers recorded.</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#161B22" }}>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Question</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Their Answer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Correct Answer</th>
                </tr>
              </thead>
              <tbody>
                {selectedWrong.map((w, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: "#30363D" }}>
                    <td className="px-4 py-3">
                      <a href={`/courses/${courseSlug}/quiz/${w.moduleSlug}`} className="text-amber-400 hover:underline">{w.moduleName}</a>
                    </td>
                    <td className="px-4 py-3 text-white max-w-xs">{w.question}</td>
                    <td className="px-4 py-3 text-red-400">{w.userAnswer}</td>
                    <td className="px-4 py-3 text-emerald-400">{w.correctAnswer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "#161B22" }}>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Student</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Enrolled</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Lessons</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Quizzes</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">XP</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Level</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Progress</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">No students enrolled yet.</td>
            </tr>
          ) : (
            students.map((s) => {
              const { overallPct, isComplete } = getProgress(s);
              const wrongCount = wrongCountByUser.get(s.user_id) ?? 0;
              return (
                <tr
                  key={s.user_id}
                  onClick={() => setSelectedId(s.user_id)}
                  className="border-t cursor-pointer transition-colors hover:bg-white/[0.03]"
                  style={{ borderColor: "#30363D" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium text-white">{s.full_name || "—"}</p>
                        <p className="text-xs text-neutral-500">{s.email}</p>
                      </div>
                      {s.banned && (
                        <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">
                          Suspended
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{new Date(s.enrolled_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className="text-white">{s.completed_lessons}</span>
                    <span className="text-neutral-500">/{s.total_lessons}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={s.passed_quizzes >= s.total_quizzes ? "text-emerald-400" : "text-white"}>{s.passed_quizzes}</span>
                    <span className="text-neutral-500">/{s.total_quizzes}</span>
                    {wrongCount > 0 && (
                      <span className="ml-2 text-xs text-red-400">({wrongCount} wrong)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-amber-400 font-medium">{s.xp}</td>
                  <td className="px-4 py-3 text-white">{s.level}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-neutral-800 max-w-[120px]">
                        <div
                          className={`h-2 rounded-full ${isComplete ? "bg-emerald-500" : overallPct > 0 ? "bg-amber-500" : "bg-neutral-700"}`}
                          style={{ width: `${overallPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-neutral-400 w-8">{overallPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
