import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import type { Course } from "@/lib/types/database";

export default async function CourseCatalogPage() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("active", true)
    .order("order");

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-red-400">Failed to load courses.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">Courses</h1>
        <p className="mt-3 text-lg text-neutral-400">
          Master cutlery sharpening with hands-on courses from Cove Blades
        </p>
      </div>

      {(!courses || courses.length === 0) ? (
        <p className="text-center text-neutral-400">No courses available yet. Check back soon!</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {(courses as Course[]).map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-all hover:border-emerald-500/50 hover:-translate-y-1">
                <div className="aspect-video bg-neutral-800">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen className="size-12 text-neutral-600" />
                    </div>
                  )}
                </div>
                <CardHeader className="pt-5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </CardTitle>
                    <Badge variant="secondary">Free</Badge>
                  </div>
                  <div className="mt-1.5">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      course.level === "entry"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : course.level === "advanced"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {course.level === "entry" ? "Entry Level" : course.level === "advanced" ? "Advanced" : "Intermediate"}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2 text-sm mt-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
