import crypto from "crypto";

// Crockford-ish base32 — excludes I, L, O, U, 0, 1 to avoid visual confusion.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomChar(): string {
  // crypto.randomInt is unbiased.
  return ALPHABET[crypto.randomInt(0, ALPHABET.length)];
}

/**
 * Returns a short, human-readable verification code:
 *   "CB-XXXX-XXXX"
 * 8 random chars from a 30-char alphabet → 30^8 ≈ 6.5e11 combinations.
 * Caller is responsible for retrying on the (vanishingly rare) unique-index collision.
 */
export function generateShortCode(): string {
  let block1 = "";
  let block2 = "";
  for (let i = 0; i < 4; i++) block1 += randomChar();
  for (let i = 0; i < 4; i++) block2 += randomChar();
  return `CB-${block1}-${block2}`;
}
