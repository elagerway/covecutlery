import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { module_quiz_id, answers } = body;

    if (!module_quiz_id || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data: quiz, error: quizError } = await supabase
      .from("module_quizzes")
      .select("*")
      .eq("id", module_quiz_id)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = quiz.questions as Array<{ correct: number }>;
    const total = questions.length;
    let score = 0;
    for (let i = 0; i < total; i++) {
      if (answers[i] === Number(questions[i].correct)) score++;
    }
    const passed = score >= Math.ceil(total * 2 / 3);

    // Check existing result
    const { data: existingResult } = await supabase
      .from("module_quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .eq("module_quiz_id", module_quiz_id)
      .maybeSingle();

    const previouslyPassed = existingResult?.passed === true;
    const xpEarned = passed && !previouslyPassed ? quiz.xp_reward : 0;

    // Save quiz result
    if (!existingResult) {
      await supabase.from("module_quiz_results").insert({
        user_id: user.id,
        module_quiz_id,
        score,
        total,
        passed,
        xp_earned: xpEarned,
        answers,
        completed_at: new Date().toISOString(),
      });
    } else if (score > existingResult.score) {
      await supabase
        .from("module_quiz_results")
        .update({
          score,
          total,
          passed,
          xp_earned: Math.max(existingResult.xp_earned, xpEarned),
          answers,
          completed_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .eq("module_quiz_id", module_quiz_id);
    }

    // Ensure profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("xp")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        user_id: user.id,
        full_name: "",
        xp: 0,
        level: 1,
        streak_days: 0,
      });
    }

    // Award XP
    let newXp = existingProfile?.xp ?? 0;
    if (xpEarned > 0) {
      await supabase.from("xp_log").insert({
        user_id: user.id,
        amount: xpEarned,
        source: "quiz",
        source_id: module_quiz_id,
      });

      newXp += xpEarned;
      await supabase
        .from("profiles")
        .update({ xp: newXp, level: getLevel(newXp) })
        .eq("user_id", user.id);
    }

    // Check achievements (non-critical — don't let failures break the response)
    const unlockedAchievements: string[] = [];
    try {
      const { count: quizCount } = await supabase
        .from("module_quiz_results")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("passed", true);

      const achievementChecks = [
        { slug: "first-quiz", condition: (quizCount ?? 0) >= 1 },
        { slug: "five-quizzes", condition: (quizCount ?? 0) >= 5 },
        { slug: "quiz-ace", condition: score === total },
      ];

      for (const check of achievementChecks) {
        if (!check.condition) continue;

        const { data: achievement } = await supabase
          .from("achievements")
          .select("*")
          .eq("slug", check.slug)
          .maybeSingle();

        if (!achievement) continue;

        const { data: existing } = await supabase
          .from("user_achievements")
          .select("id")
          .eq("user_id", user.id)
          .eq("achievement_id", achievement.id)
          .maybeSingle();

        if (existing) continue;

        await supabase.from("user_achievements").insert({
          user_id: user.id,
          achievement_id: achievement.id,
        });

        if (achievement.xp_reward > 0) {
          await supabase.from("xp_log").insert({
            user_id: user.id,
            amount: achievement.xp_reward,
            source: "achievement",
            source_id: achievement.id,
          });
          newXp += achievement.xp_reward;
          await supabase
            .from("profiles")
            .update({ xp: newXp, level: getLevel(newXp) })
            .eq("user_id", user.id);
        }

        unlockedAchievements.push(achievement.title);
      }
    } catch (achErr) {
      console.error("Achievement check error (non-fatal):", achErr);
    }

    return NextResponse.json({
      score,
      total,
      passed,
      xpEarned,
      newLevel: getLevel(newXp),
      achievements: unlockedAchievements,
    });
  } catch (err: any) {
    console.error("Quiz complete error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
