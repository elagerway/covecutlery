import { createClient } from "@/utils/supabase/server";
import JobsTable from "@/components/admin/JobsTable";

export default async function AdminJobsPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("appointment_date", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Jobs</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          All mobile bookings. Enter amount charged on the day to track totals.
        </p>
      </div>
      <JobsTable bookings={bookings ?? []} />
    </div>
  );
}
