import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

let cachedTemplate: Uint8Array | null = null;

function loadTemplate(): Uint8Array {
  if (cachedTemplate) return cachedTemplate;
  const p = path.join(process.cwd(), "public", "certificate-template.pdf");
  cachedTemplate = fs.readFileSync(p);
  return cachedTemplate;
}

function formatIssuedDate(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Vancouver",
  });
}

export interface RenderInput {
  recipientName: string;
  issuedDate: Date;
  shortCode: string;
  /** Origin used to build the verify URL line, e.g. "https://coveblades.com" */
  origin: string;
  /** When true, replaces the verify URL with a "PREVIEW" banner. */
  preview?: boolean;
}

// Coordinates measured from public/certificate-template.pdf (842 × 595 PDF points).
// Name underline:  x=265–739 (center 502),  y=250 from bottom.
// Date underline:  x=501–611 (center 556),  y=200 from bottom.
// Cert content axis is right of page-center because of the gold ribbons on the left.
const NAME_CENTER_X = 502;
const NAME_BASELINE_Y = 254;
const DATE_CENTER_X = 556;
const DATE_BASELINE_Y = 204;
const FOOTER_CENTER_X = 502;
const FOOTER_BASELINE_Y = 18;

/**
 * Loads the bundled certificate template, draws the recipient name centered on
 * the upper underline, the formatted date centered on the lower underline (after
 * "Level 1 Training on"), and a small verify-URL footer aligned with the cert's
 * visual axis at the bottom. Returns the rendered PDF bytes.
 */
export async function renderCertificate(input: RenderInput): Promise<Uint8Array> {
  const doc = await PDFDocument.load(loadTemplate());
  const page = doc.getPage(0);

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const nameSize = 28;
  const nameWidth = helvBold.widthOfTextAtSize(input.recipientName, nameSize);
  page.drawText(input.recipientName, {
    x: NAME_CENTER_X - nameWidth / 2,
    y: NAME_BASELINE_Y,
    size: nameSize,
    font: helvBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  const dateStr = formatIssuedDate(input.issuedDate);
  const dateSize = 13;
  const dateWidth = helv.widthOfTextAtSize(dateStr, dateSize);
  page.drawText(dateStr, {
    x: DATE_CENTER_X - dateWidth / 2,
    y: DATE_BASELINE_Y,
    size: dateSize,
    font: helv,
    color: rgb(0.1, 0.1, 0.1),
  });

  const footer = input.preview
    ? "PREVIEW — Not a valid certificate"
    : `Verify: ${input.origin.replace(/\/$/, "")}/certificates/${input.shortCode}`;
  const footerSize = 8;
  const footerWidth = helv.widthOfTextAtSize(footer, footerSize);
  page.drawText(footer, {
    x: FOOTER_CENTER_X - footerWidth / 2,
    y: FOOTER_BASELINE_Y,
    size: footerSize,
    font: helv,
    color: rgb(0.4, 0.4, 0.4),
  });

  return doc.save();
}
