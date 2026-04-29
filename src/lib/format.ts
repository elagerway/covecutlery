export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function formatCAD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function normalizePhone(p: string | null | undefined): string | null {
  if (!p) return null;
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (p.startsWith("+")) return p.replace(/[^+\d]/g, "");
  return p;
}

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function formatPhone(raw: string | null): string {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  // Strip leading country code 1
  const local = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
  if (local.length !== 10) return raw; // can't normalize — return as-is
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}

/**
 * Extracts the city from a Nominatim/Google-Places-formatted address.
 *  Format: "Street, City, Province Postal, Country"
 *  Edge case: if parts[1] starts with a digit (unit/suite number), use parts[2] instead.
 *  Returns null if no city can be confidently extracted.
 */
export function cityFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const candidate = parts[1]?.match(/^\d/) ? parts[2] : parts[1];
  return candidate ?? null;
}
