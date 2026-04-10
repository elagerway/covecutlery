"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, Send, Eye, CreditCard, Clock } from "lucide-react";
import { formatCAD } from "@/lib/format";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  subtotal: number;
  status: string;
  due_date: string;
  created_at: string;
  sent_at: string | null;
  paid_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#30363D", text: "#6B7280" },
  sent: { bg: "#1E90FF22", text: "#1E90FF" },
  viewed: { bg: "#D4A01722", text: "#D4A017" },
  paid: { bg: "#22C55E22", text: "#22C55E" },
  overdue: { bg: "#EF444422", text: "#EF4444" },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft: <FileText className="w-3 h-3" />,
  sent: <Send className="w-3 h-3" />,
  viewed: <Eye className="w-3 h-3" />,
  paid: <CreditCard className="w-3 h-3" />,
  overdue: <Clock className="w-3 h-3" />,
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/invoices?status=${filter}`)
      .then((r) => r.json())
      .then((data) => setInvoices(Array.isArray(data) ? data : []))
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const filters = ["all", "draft", "sent", "viewed", "paid", "overdue"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Invoices</h1>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Status filters */}
      <div className="flex gap-1.5 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
            style={{
              backgroundColor: filter === f ? "#D4A01722" : "#161B22",
              color: filter === f ? "#D4A017" : "#6B7280",
              border: `1px solid ${filter === f ? "#D4A01744" : "#30363D"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #30363D" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#161B22" }}>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Invoice #</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Client</th>
              <th className="text-right px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Amount</th>
              <th className="text-center px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Status</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Due</th>
              <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12" style={{ color: "#6B7280" }}>
                  Loading...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12" style={{ color: "#6B7280" }}>
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const colors = STATUS_COLORS[inv.status] ?? STATUS_COLORS.draft;
                return (
                  <tr
                    key={inv.id}
                    onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                    className="transition-colors hover:bg-white/5 cursor-pointer"
                    style={{ borderTop: "1px solid #30363D" }}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/admin/invoices/${inv.id}`} className="text-white font-medium hover:underline">
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white">{inv.client_name}</span>
                      <span className="block text-xs" style={{ color: "#6B7280" }}>{inv.client_email}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-white">
                      {formatCAD(inv.subtotal)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize"
                        style={{ backgroundColor: colors.bg, color: colors.text }}
                      >
                        {STATUS_ICONS[inv.status]}
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B7280" }}>
                      {inv.due_date}
                    </td>
                    <td className="px-4 py-3" style={{ color: "#6B7280" }}>
                      {new Date(inv.created_at).toLocaleDateString("en-CA")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
