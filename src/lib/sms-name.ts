// Best-effort name extraction from inbound SMS bodies.
// Returns the first plausibly-real name found, or null if nothing matches.
//
// Strategy: try a small set of high-precision patterns. We'd rather return null
// (→ "Unknown") than a false positive that gets baked into the customers table.

const FALSE_POSITIVES = new Set([
  "Yes", "No", "Ok", "Okay", "Hi", "Hey", "Hello", "Thanks", "Thank", "Sure",
  "Yep", "Nope", "Maybe", "Cool", "Great", "Good", "Bad", "Sorry", "Yo",
  "Sup", "Morning", "Evening", "Afternoon", "Night",
]);

const PATTERNS: RegExp[] = [
  // "Hi, I'm John" / "Hello this is Sarah"
  /(?:hi|hello|hey)\W+(?:i['']?m|this is|it['']?s)\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)/i,
  // "I'm John" / "this is John"
  /(?:^|[\s.,!?])(?:i['']?m|this is|it['']?s)\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)/i,
  // "John here"
  /(?:^|\.\s)([A-Z][a-z]{2,15})\s+here\b/,
  // "from John,"
  /\bfrom\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)\b/,
  // Sign-off: "...Thanks, John" / "...— John"
  /(?:thanks|cheers|regards|sincerely|—|--)[\s,]+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)[.!\s]*$/im,
];

export function extractName(body: string | null | undefined): string | null {
  if (!body) return null;
  // Strip URLs — they often contain Capital letters that confuse the regex
  const cleaned = body.replace(/https?:\/\/\S+/g, " ");

  for (const re of PATTERNS) {
    const m = cleaned.match(re);
    if (!m) continue;
    const candidate = m[1].trim();
    const firstWord = candidate.split(/\s+/)[0];
    if (FALSE_POSITIVES.has(firstWord)) continue;
    return candidate;
  }
  return null;
}

/** Try multiple message bodies (e.g. all inbound from one customer), return first match. */
export function extractNameFromMessages(bodies: (string | null | undefined)[]): string | null {
  for (const b of bodies) {
    const name = extractName(b);
    if (name) return name;
  }
  return null;
}
