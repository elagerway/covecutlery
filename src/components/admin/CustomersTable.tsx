"use client";

import { useRouter } from "next/navigation";
import { formatPhone } from "@/lib/format";

interface Customer {
  email: string;
  name: string;
  phone: string | null;
  bookingCount: number;
  totalDeposit: number;
  totalPaid: number;
  lastBookingDate: string;
}

function formatCAD(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter();

  if (customers.length === 0) {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
      >
        <p style={{ color: "#6B7280" }}>No customers yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Name</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Email</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Phone</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Bookings</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Deposits Paid</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Total Paid</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Last Booking</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr
              key={c.email}
              onClick={() => router.push(`/admin/customers/${encodeURIComponent(c.email)}`)}
              className="cursor-pointer hover:brightness-125 transition-all"
              style={{
                backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                borderBottom: "1px solid #30363D",
              }}
            >
              <td className="px-4 py-3 font-medium text-white">{c.name}</td>
              <td className="px-4 py-3" style={{ color: "#6B7280" }}>{c.email}</td>
              <td className="px-4 py-3" style={{ color: "#6B7280" }}>{formatPhone(c.phone)}</td>
              <td className="px-4 py-3 text-center" style={{ color: "#6B7280" }}>{c.bookingCount}</td>
              <td className="px-4 py-3 font-medium" style={{ color: "#D4A017" }}>
                {c.totalDeposit > 0 ? formatCAD(c.totalDeposit) : "—"}
              </td>
              <td className="px-4 py-3 font-medium" style={{ color: "#4ADE80" }}>
                {c.totalPaid > 0 ? formatCAD(c.totalPaid) : "—"}
              </td>
              <td className="px-4 py-3" style={{ color: "#6B7280" }}>{formatDate(c.lastBookingDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
