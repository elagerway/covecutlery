import { createClient } from "@/utils/supabase/server";
import CustomerDetail from "@/components/admin/CustomerDetail";
import { notFound } from "next/navigation";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail);

  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("customer_email", email)
    .order("appointment_date", { ascending: false });

  if (!bookings || bookings.length === 0) notFound();

  const latest = bookings[0];
  const customer = {
    email,
    name: latest.customer_name,
    phone: latest.customer_phone ?? null,
    address: latest.address ?? null,
  };

  return (
    <div>
      <div className="mb-8">
        <a
          href="/admin/customers"
          className="text-xs mb-3 inline-flex items-center gap-1"
          style={{ color: "#6B7280" }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Customers
        </a>
        <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{email}</p>
      </div>
      <CustomerDetail customer={customer} bookings={bookings} />
    </div>
  );
}
