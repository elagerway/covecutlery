export function formatPhone(raw: string | null): string {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  // Strip leading country code 1
  const local = digits.length === 11 && digits[0] === "1" ? digits.slice(1) : digits;
  if (local.length !== 10) return raw; // can't normalize — return as-is
  return `(${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
}
