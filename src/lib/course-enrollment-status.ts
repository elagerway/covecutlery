import { getServiceClient } from "@/lib/admin";

export async function isEnrollmentOpen(courseSlug: string): Promise<boolean> {
  const supabase = getServiceClient();
  const { data } = await supabase
    .from("courses")
    .select("enrollment_open")
    .eq("slug", courseSlug)
    .single();
  return data?.enrollment_open ?? false;
}
