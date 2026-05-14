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
}

/**
 * Loads the bundled certificate template, draws the recipient name on the upper
 * underline, the formatted date on the lower underline (after "Level 1 Training on"),
 * and a small verify-URL footer at the bottom. Returns the rendered PDF bytes.
 */
export async function renderCertificate(input: RenderInput): Promise<Uint8Array> {
  const doc = await PDFDocument.load(loadTemplate());
  const page = doc.getPage(0);
  const { width, height } = page.getSize();

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // --- Recipient name: centered on the upper underline.
  const nameSize = 28;
  const nameWidth = helvBold.widthOfTextAtSize(input.recipientName, nameSize);
  page.drawText(input.recipientName, {
    x: (width - nameWidth) / 2,
    y: height * 0.46,
    size: nameSize,
    font: helvBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  // --- Date: drawn after "Level 1 Training on " on the second line.
  const dateStr = formatIssuedDate(input.issuedDate);
  const dateSize = 13;
  const dateWidth = helv.widthOfTextAtSize(dateStr, dateSize);
  page.drawText(dateStr, {
    x: width * 0.62 - dateWidth / 2,
    y: height * 0.36,
    size: dateSize,
    font: helv,
    color: rgb(0.1, 0.1, 0.1),
  });

  // --- Footer verify URL: small, bottom-center.
  const verifyUrl = `${input.origin.replace(/\/$/, "")}/certificates/${input.shortCode}`;
  const footer = `Verify: ${verifyUrl}`;
  const footerSize = 8;
  const footerWidth = helv.widthOfTextAtSize(footer, footerSize);
  page.drawText(footer, {
    x: (width - footerWidth) / 2,
    y: 18,
    size: footerSize,
    font: helv,
    color: rgb(0.4, 0.4, 0.4),
  });

  return doc.save();
}
