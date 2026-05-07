import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600];

function getLevel(xp: number): number {
  for (let i = THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

const LESSON_XP = 10;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lesson_id } = await request.json();

  if (!lesson_id) {
    return NextResponse.json({ error: "lesson_id required" }, { status: 400 });
  }

  const { data: existingLog } = await supabase
    .from("xp_log")
    .select("id")
    .eq("user_id", user.id)
    .eq("source", "lesson")
    .eq("source_id", lesson_id)
    .single();

  let xpEarned = 0;
  if (!existingLog) {
    xpEarned = LESSON_XP;
    await supabase.from("xp_log").insert({
      user_id: user.id,
      amount: LESSON_XP,
      source: "lesson",
      source_id: lesson_id,
    });
  }

  await supabase.from("profiles").upsert(
    { user_id: user.id, full_name: "", xp: 0, level: 1, streak_days: 0 },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("xp, streak_days, last_activity_date")
    .eq("user_id", user.id)
    .single();

  const currentXp = profile?.xp ?? 0;
  const newXp = currentXp + xpEarned;
  const newLevel = getLevel(newXp);

  const today = new Date().toISOString().split("T")[0];
  const lastActivity = profile?.last_activity_date;
  let streakDays = profile?.streak_days ?? 0;

  if (lastActivity !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    streakDays = lastActivity === yesterday.toISOString().split("T")[0] ? streakDays + 1 : 1;
  }

  await supabase
    .from("profiles")
    .update({ xp: newXp, level: newLevel, streak_days: streakDays, last_activity_date: today })
    .eq("user_id", user.id);

  const unlockedAchievements: string[] = [];
  const { count: lessonCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true);

  const achievementChecks = [
    { slug: "first-lesson", condition: (lessonCount ?? 0) >= 1 },
    { slug: "five-lessons", condition: (lessonCount ?? 0) >= 5 },
    { slug: "ten-lessons", condition: (lessonCount ?? 0) >= 10 },
    { slug: "streak-3", condition: streakDays >= 3 },
    { slug: "streak-7", condition: streakDays >= 7 },
  ];

  for (const check of achievementChecks) {
    if (!check.condition) continue;

    const { data: achievement } = await supabase
      .from("achievements")
      .select("*")
      .eq("slug", check.slug)
      .single();

    if (!achievement) continue;

    const { data: existing } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", user.id)
      .eq("achievement_id", achievement.id)
      .single();

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
    }

    unlockedAchievements.push(achievement.title);
  }

  return NextResponse.json({ xpEarned, newXp, newLevel, streak: streakDays, achievements: unlockedAchievements });
}
