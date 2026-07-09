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

// Canadian postal code, e.g. "V7R 4T6" / "V7R4T6"
const POSTAL_CODE_RE = /[A-Za-z]\d[A-Za-z]\s*\d[A-Za-z]\d/g;
// A part that is only a province (bare abbreviation or full name)
const PROVINCE_RE =
  /^(?:BC|AB|SK|MB|ON|QC|NB|NS|PE|PEI|NL|YT|NT|NU|British Columbia|Alberta|Saskatchewan|Manitoba|Ontario|Quebec|Québec|New Brunswick|Nova Scotia|Prince Edward Island|Newfoundland(?: and Labrador)?|Yukon|Northwest Territories|Nunavut)$/i;
// A province abbreviation trailing a city, e.g. "North Vancouver BC"
const TRAILING_PROVINCE_RE = /\s+(?:BC|AB|SK|MB|ON|QC|NB|NS|PE|NL|YT|NT|NU)\.?$/i;

/**
 * Extracts the city from a customer-typed or Places-formatted address,
 * e.g. "Street, City, Province Postal, Country".
 *
 * This value is shown on the PUBLIC schedule widget, so it must never leak
 * customer address details: postal codes are stripped and any part containing
 * digits (street/unit numbers), a bare province, or "Canada" is rejected.
 * Returns null if no city can be confidently extracted.
 */
export function cityFromAddress(address: string | null | undefined): string | null {
  if (!address) return null;
  const parts = address
    .split(",")
    .map((p) => p.replace(POSTAL_CODE_RE, "").trim())
    .filter(Boolean);

  // parts[0] is always the street line; scan the rest for a city-shaped part
  for (let i = 1; i < parts.length; i++) {
    const candidate = parts[i].replace(TRAILING_PROVINCE_RE, "").trim();
    if (!candidate) continue;
    if (/\d/.test(candidate)) continue;
    if (PROVINCE_RE.test(candidate)) continue;
    if (/^canada$/i.test(candidate)) continue;
    return candidate;
  }
  return null;
}
