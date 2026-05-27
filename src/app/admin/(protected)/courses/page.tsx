"use client";

import { useState, useEffect } from "react";
import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  enrollment_open: boolean;
  active: boolean;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/courses/enrollment")
      .then((r) => r.json())
      .then((data) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(slug: string, current: boolean) {
    setToggling(slug);
    await fetch("/api/admin/courses/enrollment", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, enrollment_open: !current }),
    });
    setCourses((prev) =>
      prev.map((c) =>
        c.slug === slug ? { ...c, enrollment_open: !current } : c,
      ),
    );
    setToggling(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A017" }} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-1">Course Enrollment</h1>
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
        Toggle which courses accept sign-ups and payments on their detail pages.
      </p>

      <div className="space-y-3">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border p-5"
            style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
          >
            <div>
              <p className="font-semibold text-white">{c.title}</p>
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                {c.price ? `$${Number(c.price).toFixed(0)}` : "Free"}
                {" · "}
                /train-to-be-sharp/{c.slug === "train-to-be-sharp" ? "one-inch-grinder" : c.slug}
              </p>
            </div>
            <button
              onClick={() => toggle(c.slug, c.enrollment_open)}
              disabled={toggling === c.slug}
              className="shrink-0 transition-opacity disabled:opacity-50"
            >
              {toggling === c.slug ? (
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#6B7280" }} />
              ) : c.enrollment_open ? (
                <ToggleRight size={36} style={{ color: "#22C55E" }} />
              ) : (
                <ToggleLeft size={36} style={{ color: "#6B7280" }} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
