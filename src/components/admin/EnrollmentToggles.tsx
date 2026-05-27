"use client";

import { useState } from "react";
import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";

interface Course {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  enrollment_open: boolean;
}

export function EnrollmentToggles({ initial }: { initial: Course[] }) {
  const [courses, setCourses] = useState(initial);
  const [toggling, setToggling] = useState<string | null>(null);

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

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "#6B7280" }}>
        Course Enrollment
      </h2>
      <div className="space-y-2">
        {courses.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border px-4 py-3"
            style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
          >
            <div>
              <span className="text-sm font-medium text-white">{c.title}</span>
              <span className="text-xs ml-2" style={{ color: "#6B7280" }}>
                {c.price ? `$${Number(c.price).toFixed(0)}` : "Free"}
              </span>
            </div>
            <button
              onClick={() => toggle(c.slug, c.enrollment_open)}
              disabled={toggling === c.slug}
              className="shrink-0 transition-opacity disabled:opacity-50"
            >
              {toggling === c.slug ? (
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#6B7280" }} />
              ) : c.enrollment_open ? (
                <ToggleRight size={28} style={{ color: "#22C55E" }} />
              ) : (
                <ToggleLeft size={28} style={{ color: "#6B7280" }} />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
