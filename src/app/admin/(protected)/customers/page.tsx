import { createClient } from "@/utils/supabase/server";
import CustomersTable from "@/components/admin/CustomersTable";

interface Customer {
  email: string;
  name: string;
  phone: string | null;
  bookingCount: number;
  totalDeposit: number;
  totalPaid: number;
  lastBookingDate: string;
}

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  const customerMap = new Map<string, Customer>();
  for (const b of bookings ?? []) {
    if (!customerMap.has(b.customer_email)) {
      customerMap.set(b.customer_email, {
        email: b.customer_email,
        name: b.customer_name,
        phone: b.customer_phone ?? null,
        bookingCount: 0,
        totalDeposit: 0,
        totalPaid: 0,
        lastBookingDate: b.appointment_date,
      });
    }
    const c = customerMap.get(b.customer_email)!;
    c.bookingCount++;
    if (["confirmed", "completed"].includes(b.status)) {
      c.totalDeposit += b.deposit_amount ?? 0;
      c.totalPaid += (b.deposit_amount ?? 0) + (b.amount_charged ?? 0);
    }
    if (b.appointment_date > c.lastBookingDate) {
      c.lastBookingDate = b.appointment_date;
      c.name = b.customer_name;
      c.phone = b.customer_phone ?? null;
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.lastBookingDate.localeCompare(a.lastBookingDate)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          All customers derived from booking history.
        </p>
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
}
