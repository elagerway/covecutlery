"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, RotateCcw, Sparkles } from "lucide-react";
import type { ModuleQuiz as ModuleQuizType } from "@/lib/types/database";

interface ModuleQuizProps {
  quiz: ModuleQuizType;
  moduleTitle: string;
  courseSlug: string;
  nextLessonUrl?: string | null;
}

type QuizState = "intro" | "active" | "feedback" | "results";

interface QuizResult {
  score: number;
  total: number;
  passed: boolean;
  xpEarned: number;
  newLevel: number;
  achievements: string[];
}

export function ModuleQuiz({ quiz, moduleTitle, courseSlug, nextLessonUrl }: ModuleQuizProps) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [xpAnimating, setXpAnimating] = useState(false);

  const answersRef = useRef<number[]>([]);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);

  const questions = quiz.questions;
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correct;

  function handleStartQuiz() {
    setState("active");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setResult(null);
    answersRef.current = [];
    submittedRef.current = false;
  }

  function handleSelectAnswer(optionIndex: number) {
    if (state !== "active" || isSubmitting) return;
    setSelectedAnswer(optionIndex);
    setState("feedback");

    // Store answer and advance after delay
    const newAnswers = [...answersRef.current, optionIndex];
    answersRef.current = newAnswers;

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);

    feedbackTimerRef.current = setTimeout(() => {
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setState("active");
      } else {
        if (!submittedRef.current) {
          submittedRef.current = true;
          submitQuiz(newAnswers);
        }
      }
    }, 1500);
  }

  async function submitQuiz(finalAnswers: number[]) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/gamification/quiz-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module_quiz_id: quiz.id, answers: finalAnswers }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("Quiz API error:", res.status, errBody);
        throw new Error(`Quiz submission failed: ${res.status}`);
      }

      const data: QuizResult = await res.json();
      setResult(data);
      setState("results");
      if (data.passed) setTimeout(() => setXpAnimating(true), 300);
    } catch (error: any) {
      console.error("Quiz submission error:", error);
      setResult({ score: 0, total: questions.length, passed: false, xpEarned: 0, newLevel: 1, achievements: [] });
      setState("results");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (state === "intro") {
    return (
      <Card className="mx-auto max-w-lg overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Brain className="size-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Module Quiz: {moduleTitle}</h3>
            <p className="mt-2 text-neutral-400">
              {questions.length} quick questions to test what you learned
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            <Sparkles className="size-4" />
            Earn up to {quiz.xp_reward} XP
          </div>
          <Button size="lg" className="w-full max-w-xs" onClick={handleStartQuiz}>
            Start Quiz
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state === "results" && result) {
    const perfect = result.score === result.total;
    const passed = result.passed;

    return (
      <Card className="mx-auto max-w-lg overflow-hidden">
        <CardContent className="flex flex-col items-center gap-6 py-10 text-center">
          <span className="text-6xl">{perfect ? "\u{1F3C6}" : passed ? "\u{1F3AF}" : "\u{1F4AA}"}</span>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {perfect ? "Perfect Score!" : passed ? "Great Job!" : "Keep Going!"}
            </h3>
            <p className="mt-1 text-neutral-400">
              {passed ? "You passed!" : "Review the material and try again."}
            </p>
          </div>
          <div className="text-4xl font-bold text-white">{result.score} / {result.total}</div>
          {result.xpEarned > 0 && (
            <div className={`text-lg font-bold text-emerald-400 transition-all duration-700 ${xpAnimating ? "opacity-100" : "opacity-0"}`}>
              +{result.xpEarned} XP earned!
            </div>
          )}
          <div className="flex w-full max-w-xs flex-col gap-3">
            {passed ? (
              <Button size="lg" onClick={() => router.push(nextLessonUrl ?? `/courses/${courseSlug}`)}>
                Continue to Next Lesson
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleStartQuiz}>
                <RotateCcw className="mr-2 size-4" />
                Retake Quiz
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={() => router.push(`/courses/${courseSlug}`)}>
              Back to Course
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg overflow-hidden">
      <CardContent className="py-8">
        <div className="mb-6 flex items-center justify-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentQuestion ? "w-8 bg-emerald-500" : i < currentQuestion ? "w-2 bg-emerald-500/50" : "w-2 bg-neutral-700"
              }`}
            />
          ))}
        </div>

        <p className="mb-2 text-center text-sm text-neutral-400">
          Question {currentQuestion + 1} of {questions.length}
        </p>

        <h3 className="mb-6 text-center text-lg font-semibold text-white">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let classes = "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200 ";
            if (state === "feedback") {
              if (index === question.correct) classes += "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              else if (index === selectedAnswer) classes += "border-red-500 bg-red-500/10 text-red-400";
              else classes += "border-neutral-700 bg-neutral-900 opacity-50 text-neutral-400";
            } else {
              classes += "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer";
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={state === "feedback" || isSubmitting}
                className={classes}
              >
                <span className="mr-3 inline-flex size-6 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {state === "feedback" && (
          <div className="mt-4 text-center">
            {isCorrect ? (
              <p className="text-sm font-medium text-emerald-400">Correct!</p>
            ) : (
              <p className="text-sm font-medium text-red-400">
                Not quite! The answer is {String.fromCharCode(65 + question.correct)}: {question.options[question.correct]}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
