const ALLOWED_HOSTS = [
  "coveblades.com",
  "www.coveblades.com",
  "staging.coveblades.com",
];

const PROD_ORIGIN = "https://coveblades.com";

type HasHeaders = { headers: { get: (name: string) => string | null } };

export function safeOrigin(req: HasHeaders): string {
  const reqOrigin = req.headers.get("origin");
  if (process.env.NODE_ENV === "development") {
    return reqOrigin ?? PROD_ORIGIN;
  }
  if (!reqOrigin) return PROD_ORIGIN;
  try {
    const host = new URL(reqOrigin).host;
    return ALLOWED_HOSTS.includes(host) ? reqOrigin : PROD_ORIGIN;
  } catch {
    return PROD_ORIGIN;
  }
}
